/* eslint-disable */
let config = { db: { host: '127.0.0.1' } };

const ObjectId = require('mongodb').ObjectId;

// mocks
const { MongoMemoryServer } = require('mongodb-memory-server');
const Router = require('../utils/router-mock');
const router = new Router();

// tools
const chai = require('chai');
const expect = chai.expect;

// setup
const dbm = require('../../src/helpers/db');

const executionService = require('../../src/services/execution.service.js');
let to;
let mongod;
let Executions;
let TestCases;

const fixtures = require('./fixtures/execution.fixture');


// tests

describe('execution : service', () => {
  before(async () => {
    try {
      mongod = new MongoMemoryServer();
      config.db.port = await mongod.getPort();
      config.db.name = await mongod.getDbName()
      
      await dbm.connect(config);
      await executionService.load();
      to = executionService;
  
      Executions = await dbm.getCollection('executions');
      TestCases = await dbm.getCollection('testcases');
      await Executions.deleteMany();
    } catch (e) {
      console.error(e)
    }
  });

  beforeEach(async () => {
    await Executions.insertMany(fixtures.initialObjects.map(x => { delete x._id; return x; }));
  });
  afterEach(async () => {
    await Executions.deleteMany();
  });
  describe('getExecutions', () => {
    it('should return executions', async () => {
      const result = await to.getExecutions();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.eql(fixtures.initialObjects[0]);
      expect(result[1]).to.eql(fixtures.initialObjects[1]);
    });

    it('should return limited executions', async () => {
      const result = await to.getExecutions({}, { limit: 1 });
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    });
  });

  describe('getExecution', () => {
    it('should return one execution', async () => {
      const result = await to.getExecution(fixtures.initialObjects[0]._id.toString());
      expect(result).to.be.an('object');
      expect(result).to.eql(fixtures.initialObjects[0]);
    });
  });

  describe('postExecutions', () => {
    it('should save execution', async () => {
      fixtures.testCase1._id = ObjectId(fixtures.testCase1._id);
      const testCase1Result = await TestCases.insertOne(fixtures.testCase1);

      const result = await to.postExecution(fixtures.execution1, fixtures.user1, true);

      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.not.be.undefined;
      const newExecution = await Executions.findOne({ _id: result._id });
      expect(newExecution.title).to.equal(fixtures.execution1.title);
      expect(newExecution.description).to.equal(fixtures.execution1.description);
      expect(newExecution.testCaseId.toString()).to.equal(fixtures.testCase1._id.toString());
      expect(newExecution.testSteps).to.eql(fixtures.testCase1.testSteps);
      expect(newExecution.createdAt).to.not.be.undefined;
      expect(newExecution.updatedAt).to.not.be.undefined;
      expect(result.data).to.not.be.undefined;
    });
  });

  describe('putExecutions', () => {
    it('should save execution', async () => {
      let oldExecution = {
        title: "test-put-execution",
        createdAt: new Date(),
        status: "PENDING",
        user: {}
      };
      const changes = { title: "test-execution" };
      const newExecutionResult = await Executions.insertOne(fixtures.execution2);
      const result = await to.putExecution(newExecutionResult.insertedId.toString(), changes);
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newExecutionResult.insertedId);
      const newExecution = await Executions.findOne({ _id: newExecutionResult.insertedId });
      expect(newExecution).to.be.an('object');
      expect(newExecution.title).to.equal(changes.title);
    });

    it('should reset execution, no steps', async () => {
      let newTestCaseResult = await TestCases.insertOne({ title: 'dummy-test-case' });
      let oldExecution = {
        title: "test-put-execution",
        testCaseId: newTestCaseResult.insertedId,
        createdAt: new Date(),
        status: "WORKING",
        testSteps: [{ "step": 1 }, { "step": 2 }],
        user: {}
      };

      let newExecutionResult = await Executions.insertOne(oldExecution);

      const result = await to.putExecution(newExecutionResult.insertedId.toString(), null);
      let newExecution = await Executions.findOne({ _id: newExecutionResult.insertedId });

      expect(result).to.be.an('object');
      expect(newExecution.title).to.equal(oldExecution.title);
      expect(newExecution.createdAt).to.not.be.undefined;
      expect(newExecution.updatedAt).to.not.be.undefined;
      expect(newExecution.user).to.not.be.undefined;
      expect(newExecution.status).to.eql('PENDING');
      expect(newExecution.testSteps).to.be.an('array');
      expect(newExecution.testSteps).to.have.lengthOf(0);
    });

    it('should reset execution, with steps', async () => {
      const testCase = {
        title: 'dummy-test-case',
        testSteps: [{ "originalstep": 1 }, { "originalstep": 2 }]
      };
      let newTestCaseResult = await TestCases.insertOne(testCase);
      let oldExecution = {
        title: "test-put-execution",
        testCaseId: newTestCaseResult.insertedId,
        createdAt: new Date(),
        status: "WORKING",
        testSteps: [{ "step": 1 }],
        user: {}
      };

      let newExecutionResult = await Executions.insertOne(oldExecution);
      const result = await to.putExecution(newExecutionResult.insertedId.toString(), null, { username: "testuser" });
      let newExecution = await Executions.findOne({ _id: newExecutionResult.insertedId });

      expect(result).to.be.an('object');
      expect(newExecution.title).to.equal(oldExecution.title);
      expect(newExecution.createdAt).to.not.be.undefined;
      expect(newExecution.updatedAt).to.not.be.undefined;
      expect(newExecution.user).to.not.be.undefined;
      expect(newExecution.status).to.eql('PENDING');
      expect(newExecution.testSteps).to.be.an('array');
      expect(newExecution.testSteps).to.have.lengthOf(2);
      expect(newExecution.testSteps).to.eql(testCase.testSteps);
    });
  });


});


after(async () => {
  mongod.stop();
});
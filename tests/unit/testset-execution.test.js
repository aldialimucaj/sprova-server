/* eslint-disable */
let config = { db: { host: '127.0.0.1' } };

// mocks
const { MongoMemoryServer } = require('mongodb-memory-server');

// tools
const chai = require('chai');
const expect = chai.expect;

// setup
const dbm = require('../../src/helpers/db');

// test object
const testSetExecutionService = require('../../src/services/testset-execution.service');

let to;
let mongod;
let TestSetExecutions, TestSets, TestCases;

const fixtures = require('./fixtures/testset-execution.fixture');



describe('testSetExecution : service', () => {
  before(async () => {
    try {
      mongod = new MongoMemoryServer();
      config.db.port = await mongod.getPort();
      config.db.name = await mongod.getDbName()

      await dbm.connect(config);
      await testSetExecutionService.load();
      to = testSetExecutionService;
  
      TestSetExecutions = await dbm.getCollection('testset-executions');
      TestSets = await dbm.getCollection('testsets');
      TestCases = await dbm.getCollection('testcases');
      await TestSetExecutions.deleteMany();
    } catch (e) {
      console.error(e)
    }
  });


  let fixture1testsetsResult;
  beforeEach(async () => {
    let fixture1testcasesResult = await TestCases.insertMany(fixtures.fixture1testcases.map(x => { delete x._id; return x; }));
    fixtures.fixture1testsets[0].testCases = Object.values(fixture1testcasesResult.insertedIds);
    fixture1testsetsResult = await TestSets.insertMany(fixtures.fixture1testsets.map(x => { delete x._id; return x; }));
    await TestSetExecutions.insertMany(fixtures.initialObjects.map(x => { delete x._id; return x; }));
  });
  afterEach(async () => {
    await TestSetExecutions.deleteMany();
  });

  describe('getTestSetExecutions', () => {

    it('should return testSetExecutions', async () => {
      const result = await to.getTestSetExecutions();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.eql(fixtures.initialObjects[0]);
      expect(result[1]).to.eql(fixtures.initialObjects[1]);
    });

    it('should return limited testSetExecutions', async () => {
      const result = await to.getTestSetExecutions({}, { limit: 1 });
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    });
  });

  describe('getTestSetExecution', () => {
    it('should return one testSetExecution', async () => {
      const result = await to.getTestSetExecution(fixtures.initialObjects[0]._id.toString());
      expect(result).to.be.an('object');
      expect(result).to.eql(fixtures.initialObjects[0]);
    });
  });

  describe('postTestSetExecutions', () => {
    it('should save testSetExecution', async () => {
      fixtures.testSetExecution1.testSetId = fixture1testsetsResult.insertedIds[0]
      const result = await to.postTestSetExecution(fixtures.testSetExecution1);
      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.not.be.undefined;
      const newTestSetExecution = await TestSetExecutions.findOne({ _id: result._id });
      expect(newTestSetExecution.title).to.equal(fixtures.testSetExecution1.title);
      expect(newTestSetExecution.createdAt).to.not.be.undefined;
    });
  });

  describe('putTestSetExecution', () => {
    it('should change testSetExecution', async () => {
      const changes = { title: "test-testSetExecution" };
      const oldTestSetExecution = { title: "test-put-testSetExecution" };
      const newTestSetExecutionResult = await TestSetExecutions.insertOne(fixtures.testSetExecution2);
      const result = await to.putTestSetExecution(newTestSetExecutionResult.insertedId.toString(), changes);
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestSetExecutionResult.insertedId);
      const newTestSetExecution = await TestSetExecutions.findOne({ _id: newTestSetExecutionResult.insertedId });
      expect(newTestSetExecution).to.be.an('object');
      expect(newTestSetExecution.title).to.equal(changes.title);
    });
  });

  describe('delTestSetExecution', () => {
    it('should change testSetExecution', async () => {
      let newTestSetExecutionResult = await TestSetExecutions.insertOne(fixtures.testSetExecution3);
      const result = await to.delTestSetExecution(newTestSetExecutionResult.insertedId.toString());
      let newTestSetExecution = await TestSetExecutions.findOne({ _id: newTestSetExecutionResult.insertedId });
      expect(newTestSetExecution).to.be.null;
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestSetExecutionResult.insertedId);
    });
  });

});


after(async () => {
  mongod.stop();
});
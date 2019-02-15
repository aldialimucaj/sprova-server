/* eslint-disable */
let config = { db: { host: '127.0.0.1' } };

// mocks
const { MongoMemoryServer } = require('mongodb-memory-server');

// tools
const chai = require('chai');
const expect = chai.expect;

// setup
const DatabaseManager = require('../../src/helpers/db');

// test object
const TestCaseService = require('../../src/services/testcase.service');

let to;
let mongod;
let TestCases;

const fixtures = require('./fixtures/testcase.fixture');


describe('testcase : service', () => {
  before(async () => {
    try {
      mongod = new MongoMemoryServer();
      const uriStr = await mongod.getConnectionString();
      config.db.port = await mongod.getPort();
      config.db.name = await mongod.getDbName()
      const databaseManager = new DatabaseManager(config)
  
      var db = await databaseManager.connect();
      to = new TestCaseService(db);
  
      TestCases = db.collection('testcases');
      await TestCases.deleteMany();
    } catch (e) {
      console.error(e)
    }
  });
  
  beforeEach(async () => {
    await TestCases.insertMany(fixtures.initialObjects.map(x => { delete x._id; return x; }));
  });
  afterEach(async () => {
    await TestCases.deleteMany();
  });

  describe('getTestCases', () => {

    it('should return testcases', async () => {
      const result = await to.getTestCases(null, false);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.be.eql(fixtures.initialObjects[0]);
      expect(result[1]).to.be.eql(fixtures.initialObjects[1]);
    });

    it('should return limited testcases', async () => {
      const result = await to.getTestCases({}, { limit: 1 }, false);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    });
  });

  describe('getTestCase', () => {
    it('should return one testcase', async () => {
      const result = await to.getTestCase(fixtures.initialObjects[0]._id.toString());
      expect(result).to.be.an('object');
      expect(result).to.eql(fixtures.initialObjects[0]);
    });
  });

  describe('postTestCases', () => {
    it('should save testcase', async () => {
      const result = await to.postTestCase(fixtures.testcase1);
      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.not.be.undefined;
      const newTestCase = await TestCases.findOne({ _id: result._id });
      expect(newTestCase.title).to.equal(fixtures.testcase1.title);
      expect(newTestCase.createdAt).to.not.be.undefined;
      expect(newTestCase.updatedAt).to.not.be.undefined;
    });
  });

  describe('putTestCase', () => {
    it('should change testcase', async () => {
      const changes = { title: "test-testcase" };
      const oldTestCase = { title: "test-put-testcase" };
      const newTestCaseResult = await TestCases.insertOne(fixtures.testcase2);
      const result = await to.putTestCase(newTestCaseResult.insertedId.toString(), changes);
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestCaseResult.insertedId);
      const newTestCase = await TestCases.findOne({ _id: newTestCaseResult.insertedId });
      expect(newTestCase).to.be.an('object');
      expect(newTestCase.title).to.equal(changes.title);
    });
  });

  describe('delTestCase', () => {
    it('should change testcase', async () => {
      let newTestCaseResult = await TestCases.insertOne(fixtures.testcase3);
      const result = await to.delTestCase(newTestCaseResult.insertedId.toString());
      let newTestCase = await TestCases.findOne({ _id: newTestCaseResult.insertedId });
      expect(newTestCase).to.be.null;
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestCaseResult.insertedId);
    });
  });

});


after(async () => {
  mongod.stop();
});
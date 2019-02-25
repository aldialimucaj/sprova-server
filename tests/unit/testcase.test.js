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

    it('should copy testcase with cloneFromId', async () => {
      let newTestCaseResult1 = await TestCases.insertOne(fixtures.testcase1);
      fixtures.testcase2.parentId = newTestCaseResult1.insertedId;
      let newTestCaseResult2 = await TestCases.insertOne(fixtures.testcase2);
      fixtures.testcase3.parentId = newTestCaseResult1.insertedId;
      let newTestCaseResult3 = await TestCases.insertOne(fixtures.testcase3);
      fixtures.testcase4.parentId = newTestCaseResult2.insertedId;
      let newTestCaseResult4 = await TestCases.insertOne(fixtures.testcase4);
      fixtures.testcase5.parentId = newTestCaseResult2.insertedId;
      let newTestCaseResult5 = await TestCases.insertOne(fixtures.testcase5);

      let originalTestCase = await TestCases.findOne({ _id: newTestCaseResult2.insertedId })
      originalTestCase.cloneFromId = newTestCaseResult2.insertedId;
      originalTestCase.parentId = newTestCaseResult1.insertedId;

      const initTestCaseCount = await TestCases.count();

      const result = await to.postTestCase(originalTestCase);
      const endTestCaseCount = await TestCases.count();
      expect(endTestCaseCount).to.eq(initTestCaseCount + 3);
      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.not.be.undefined;
      const newTestCase = await TestCases.findOne({ _id: result._id });
      expect(newTestCase).to.not.be.null;
      const newTestChildrenCount = await TestCases.count({ parentId: result._id });
      expect(newTestChildrenCount).to.be.eql(2);

    });
  });

  describe('postTestCases batch', () => {
    it('should save testcase', async () => {
      const result = await to.postTestCase([fixtures.testcase1, fixtures.testcase2]);
      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(result._ids).to.have.lengthOf(2);
      const newTestCase = await TestCases.findOne({ _id: result._ids[0] });
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
    it('should delete testcase', async () => {
      const initTestCaseCount = await TestCases.count();
      let newTestCaseResult = await TestCases.insertOne(fixtures.testcase3);
      const result = await to.delTestCase(newTestCaseResult.insertedId.toString());
      let newTestCase = await TestCases.findOne({ _id: newTestCaseResult.insertedId });
      expect(newTestCase).to.be.null;
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestCaseResult.insertedId);

      const endTestCaseCount = await TestCases.count();
      expect(endTestCaseCount).to.eq(initTestCaseCount);
    });
  });

  describe('delTestCase with child', () => {

    it('should delete testcases with 3 generations', async () => {
      const initTestCaseCount = await TestCases.count();

      let newTestCaseResult1 = await TestCases.insertOne(fixtures.testcase1);
      fixtures.testcase2.parentId = newTestCaseResult1.insertedId;
      let newTestCaseResult2 = await TestCases.insertOne(fixtures.testcase2);
      fixtures.testcase3.parentId = newTestCaseResult2.insertedId;
      let newTestCaseResult3 = await TestCases.insertOne(fixtures.testcase3);

      const result = await to.delTestCase(newTestCaseResult1.insertedId.toString());
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestCaseResult1.insertedId);

      let newTestCase1 = await TestCases.findOne({ _id: newTestCaseResult1.insertedId });
      expect(newTestCase1).to.be.null;
      let newTestCase2 = await TestCases.findOne({ _id: newTestCaseResult2.insertedId });
      expect(newTestCase2).to.be.null;
      let newTestCase3 = await TestCases.findOne({ _id: newTestCaseResult3.insertedId });
      expect(newTestCase3).to.be.null;

      const endTestCaseCount = await TestCases.count();
      expect(endTestCaseCount).to.eq(initTestCaseCount);
    });

    it('should delete testcases with 5 generations', async () => {
      const initTestCaseCount = await TestCases.count();
      let newTestCaseResult1 = await TestCases.insertOne(fixtures.testcase1);
      fixtures.testcase2.parentId = newTestCaseResult1.insertedId;
      let newTestCaseResult2 = await TestCases.insertOne(fixtures.testcase2);
      fixtures.testcase3.parentId = newTestCaseResult2.insertedId;
      let newTestCaseResult3 = await TestCases.insertOne(fixtures.testcase3);
      fixtures.testcase4.parentId = newTestCaseResult3.insertedId;
      let newTestCaseResult4 = await TestCases.insertOne(fixtures.testcase4);
      fixtures.testcase5.parentId = newTestCaseResult4.insertedId;
      let newTestCaseResult5 = await TestCases.insertOne(fixtures.testcase5);


      const result = await to.delTestCase(newTestCaseResult1.insertedId.toString());
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestCaseResult1.insertedId);

      let newTestCase1 = await TestCases.findOne({ _id: newTestCaseResult1.insertedId });
      expect(newTestCase1).to.be.null;
      let newTestCase2 = await TestCases.findOne({ _id: newTestCaseResult2.insertedId });
      expect(newTestCase2).to.be.null;
      let newTestCase3 = await TestCases.findOne({ _id: newTestCaseResult3.insertedId });
      expect(newTestCase3).to.be.null;
      let newTestCase4 = await TestCases.findOne({ _id: newTestCaseResult4.insertedId });
      expect(newTestCase4).to.be.null;
      let newTestCase5 = await TestCases.findOne({ _id: newTestCaseResult5.insertedId });
      expect(newTestCase5).to.be.null;

      const endTestCaseCount = await TestCases.count();
      expect(endTestCaseCount).to.eq(initTestCaseCount);
    });

    it('should delete testcases with a tree shape', async () => {
      const initTestCaseCount = await TestCases.count();
      let newTestCaseResult1 = await TestCases.insertOne(fixtures.testcase1);
      fixtures.testcase2.parentId = newTestCaseResult1.insertedId;
      let newTestCaseResult2 = await TestCases.insertOne(fixtures.testcase2);
      fixtures.testcase3.parentId = newTestCaseResult1.insertedId;
      let newTestCaseResult3 = await TestCases.insertOne(fixtures.testcase3);
      fixtures.testcase4.parentId = newTestCaseResult2.insertedId;
      let newTestCaseResult4 = await TestCases.insertOne(fixtures.testcase4);
      fixtures.testcase5.parentId = newTestCaseResult2.insertedId;
      let newTestCaseResult5 = await TestCases.insertOne(fixtures.testcase5);

      const midTestCaseCount = await TestCases.count();
      expect(midTestCaseCount).to.eq(initTestCaseCount + 5);

      const result = await to.delTestCase(newTestCaseResult1.insertedId.toString());
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestCaseResult1.insertedId);
      const endTestCaseCount = await TestCases.count();
      expect(endTestCaseCount).to.eq(initTestCaseCount);

      let newTestCase1 = await TestCases.findOne({ _id: newTestCaseResult1.insertedId });
      expect(newTestCase1).to.be.null;
      let newTestCase2 = await TestCases.findOne({ _id: newTestCaseResult2.insertedId });
      expect(newTestCase2).to.be.null;
      let newTestCase3 = await TestCases.findOne({ _id: newTestCaseResult3.insertedId });
      expect(newTestCase3).to.be.null;
      let newTestCase4 = await TestCases.findOne({ _id: newTestCaseResult4.insertedId });
      expect(newTestCase4).to.be.null;
      let newTestCase5 = await TestCases.findOne({ _id: newTestCaseResult5.insertedId });
      expect(newTestCase5).to.be.null;
    });
  });

});


after(async () => {
  mongod.stop();
});
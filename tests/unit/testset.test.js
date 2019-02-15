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
const TestSetService = require('../../src/services/testset.service');

let to;
let mongod;
let TestSets;

const fixtures = require('./fixtures/testset.fixture');

describe('testSet : service', () => {
  before(async () => {
    try {
      mongod = new MongoMemoryServer();
      const uriStr = await mongod.getConnectionString();
      config.db.port = await mongod.getPort();
      config.db.name = await mongod.getDbName()
      const databaseManager = new DatabaseManager(config)

      var db = await databaseManager.connect();
      to = new TestSetService(db);

      TestSets = db.collection('testsets');
      await TestSets.deleteMany();
    } catch (e) {
      console.error(e)
    }
  });

  beforeEach(async () => {
    await TestSets.insertMany(fixtures.initialObjects.map(x => { delete x._id; return x; }));
  });
  afterEach(async () => {
    await TestSets.deleteMany();
  });

  describe('getTestSets', () => {

    it('should return testSets', async () => {
      const result = await to.getTestSets();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.eql(fixtures.initialObjects[0]);
      expect(result[1]).to.eql(fixtures.initialObjects[1]);
    });

    it('should return limited testSets', async () => {
      const result = await to.getTestSets({}, { limit: 1 });
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    });
  });

  describe('getTestSet', () => {
    it('should return one testSet', async () => {
      const result = await to.getTestSet(fixtures.initialObjects[0]._id.toString());
      expect(result).to.be.an('object');
      expect(result).to.eql(fixtures.initialObjects[0]);
    });
  });

  describe('postTestSets', () => {
    it('should save testSet', async () => {
      const result = await to.postTestSet(fixtures.testSet1);
      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.not.be.undefined;
      const newTestSet = await TestSets.findOne({ _id: result._id });
      expect(newTestSet.title).to.equal(fixtures.testSet1.title);
      expect(newTestSet.createdAt).to.not.be.undefined;
      expect(newTestSet.updatedAt).to.not.be.undefined;
    });
  });

  describe('putTestSet', () => {
    it('should change testSet', async () => {
      const changes = { title: "test-testSet" };
      const oldTestSet = { title: "test-put-testSet" };
      const newTestSetResult = await TestSets.insertOne(fixtures.testSet2);
      const result = await to.putTestSet(newTestSetResult.insertedId.toString(), changes);
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestSetResult.insertedId);
      const newTestSet = await TestSets.findOne({ _id: newTestSetResult.insertedId });
      expect(newTestSet).to.be.an('object');
      expect(newTestSet.title).to.equal(changes.title);
    });
  });

  describe('delTestSet', () => {
    it('should change testSet', async () => {
      let newTestSetResult = await TestSets.insertOne(fixtures.testSet3);
      const result = await to.delTestSet(newTestSetResult.insertedId.toString());
      let newTestSet = await TestSets.findOne({ _id: newTestSetResult.insertedId });
      expect(newTestSet).to.be.null;
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newTestSetResult.insertedId);
    });
  });

});


after(async () => {
  mongod.stop();
});
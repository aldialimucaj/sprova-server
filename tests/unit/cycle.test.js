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
const CycleService = require('../../src/services/cycle.service');

let to;
let mongod;
let Cycles;

const fixtures = require('./fixtures/cycle.fixture');

before(async () => {
  try {
    mongod = new MongoMemoryServer();
    const uriStr = await mongod.getConnectionString();
    config.db.port = await mongod.getPort();
    config.db.name = await mongod.getDbName()
    const databaseManager = new DatabaseManager(config)

    var db = await databaseManager.connect();
    to = new CycleService(db);

    Cycles = db.collection('cycles');
    await Cycles.deleteMany();
  } catch (e) {
    console.error(e)
  }
});



describe('cycle : service', () => {
  beforeEach(async () => {
    await Cycles.insertMany(fixtures.initialObjects.map(x => { delete x._id; return x; }));
  });
  afterEach(async () => {
    await Cycles.deleteMany();
  });

  describe('getCycles', () => {


    it('should return cycles', async () => {
      const result = await to.getCycles();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.eql(fixtures.initialObjects[0]);
      expect(result[1]).to.eql(fixtures.initialObjects[1]);
    });

    it('should return limited cycles', async () => {
      const result = await to.getCycles({}, { limit: 1 });
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    });
  });

  describe('getCycle', () => {
    it('should return one cycle', async () => {
      const result = await to.getCycle(fixtures.initialObjects[0]._id.toString());
      expect(result).to.be.an('object');
      expect(result).to.eql(fixtures.initialObjects[0]);
    });
  });

  describe('postCycles', () => {
    it('should save cycle', async () => {
      const result = await to.postCycle(fixtures.cycle1);
      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.not.be.undefined;
      const newCycle = await Cycles.findOne({ _id: result._id });
      expect(newCycle.title).to.equal(fixtures.cycle1.title);
      expect(newCycle.createdAt).to.not.be.undefined;
      expect(newCycle.updatedAt).to.not.be.undefined;
    });
  });

  describe('putCycle', () => {
    it('should change cycle', async () => {
      const changes = { title: "test-cycle" };
      const oldCycle = { title: "test-put-cycle" };
      const newCycleResult = await Cycles.insertOne(fixtures.cycle2);
      const result = await to.putCycle(newCycleResult.insertedId.toString(), changes);
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newCycleResult.insertedId);
      const newCycle = await Cycles.findOne({ _id: newCycleResult.insertedId });
      expect(newCycle).to.be.an('object');
      expect(newCycle.title).to.equal(changes.title);
    });
  });

  describe('delCycle', () => {
    it('should change cycle', async () => {
      let newCycleResult = await Cycles.insertOne(fixtures.cycle3);
      const result = await to.delCycle(newCycleResult.insertedId.toString());
      let newCycle = await Cycles.findOne({ _id: newCycleResult.insertedId });
      expect(newCycle).to.be.null;
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newCycleResult.insertedId);
    });
  });

});


after(async () => {
  mongod.stop();
});
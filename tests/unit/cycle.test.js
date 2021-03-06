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
const cycleService = require('../../src/services/cycle.service');

let to;
let mongod;
let Cycles;

const fixtures = require('./fixtures/cycle.fixture');




describe('cycle : service', () => {
  before(async () => {
    try {
      mongod = new MongoMemoryServer();
      config.db.port = await mongod.getPort();
      config.db.name = await mongod.getDbName()

      await dbm.connect(config);
      await cycleService.load();
      to = cycleService;
  
      Cycles = await dbm.getCollection('cycles');
      await Cycles.deleteMany();
    } catch (e) {
      console.error(e)
    }
  });

  
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
      const result = await to.getCycle(fixtures.initialObjects[0]._id);
      expect(result).to.be.an('object');
      expect(result).to.eql(fixtures.initialObjects[0]);
    });
  });

  describe('postCycles', () => {
    it('should save cycle', async () => {
      const result = await to.postCycle(fixtures.cycle1);
      expect(result).to.be.an('object');
      expect(result.title).to.be.eql(fixtures.cycle1.title);
      expect(result._id).to.not.be.undefined;
      const newCycle = await Cycles.findOne({ _id: result._id });
      expect(newCycle.title).to.equal(fixtures.cycle1.title);
    });
  });

  describe('putCycle', () => {
    it('should change cycle', async () => {
      const changes = { title: "test-cycle" };
      const response = await Cycles.insertOne(fixtures.cycle2);
      const newCycleResult = response.ops[0];
      const result = await to.putCycle(newCycleResult._id, changes);
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newCycleResult._id);
      const newCycle = await Cycles.findOne({ _id: newCycleResult._id });
      expect(newCycle).to.be.an('object');
      expect(newCycle.title).to.equal(changes.title);
    });
  });

  describe('delCycle', () => {
    it('should change cycle', async () => {
      let newCycleResult = await Cycles.insertOne(fixtures.cycle3);
      const result = await to.delCycle(newCycleResult._id);
      let newCycle = await Cycles.findOne({ _id: newCycleResult._id });
      expect(newCycle).to.be.null;
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newCycleResult._id);
    });
  });

});


after(async () => {
  mongod.stop();
});
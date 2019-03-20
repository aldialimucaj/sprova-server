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
const artifactService = require('../../src/services/artifact.service');

let to;
let mongod;
let Artifacts;

const fixtures = require('./fixtures/artifact.fixture');


describe('artifact : service', () => {

  before(async () => {
    try {
      mongod = new MongoMemoryServer();
      config.db.port = await mongod.getPort();
      config.db.name = await mongod.getDbName()
  
      await dbm.connect(config);
      artifactService.load();
      to = artifactService;
  
      Artifacts = db.collection('artifacts');
      await Artifacts.deleteMany();
    } catch (e) {
      console.error(e)
    }
  });
  
  
  

  beforeEach(async () => {
    await Artifacts.insertMany(fixtures.initialObjects.map(x => { delete x._id; return x; }));
  });
  afterEach(async () => {
    await Artifacts.deleteMany();
  });

  describe('getArtifacts', () => {

    it('should return artifacts', async () => {
      const result = await to.getArtifacts();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.eql(fixtures.initialObjects[0]);
      expect(result[1]).to.eql(fixtures.initialObjects[1]);
    });

    it('should return limited artifacts', async () => {
      const result = await to.getArtifacts({}, { limit: 1 });
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    });
  });

  describe('getArtifact', () => {
    it('should return one artifact', async () => {
      const result = await to.getArtifact(fixtures.initialObjects[0]._id.toString());
      expect(result).to.be.an('object');
      expect(result).to.eql(fixtures.initialObjects[0]);
    });
  });

  describe('postArtifacts', () => {
    it('should save artifact', async () => {
      const result = await to.postArtifact(fixtures.artifact1, {});
      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.not.be.undefined;
      const newArtifact = await Artifacts.findOne({ _id: result._id });
      expect(newArtifact.title).to.equal(fixtures.artifact1.title);
      expect(newArtifact.createdAt).to.not.be.undefined;
      expect(newArtifact.updatedAt).to.not.be.undefined;
    });
  });

  describe('putArtifact', () => {
    it('should change artifact', async () => {
      const changes = { title: "test-artifact" };
      const oldArtifact = { title: "test-put-artifact" };
      const newArtifactResult = await Artifacts.insertOne(fixtures.artifact2);
      const result = await to.putArtifact(newArtifactResult.insertedId.toString(), changes);
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newArtifactResult.insertedId);
      const newArtifact = await Artifacts.findOne({ _id: newArtifactResult.insertedId });
      expect(newArtifact).to.be.an('object');
      expect(newArtifact.title).to.equal(changes.title);
    });
  });

  describe('delArtifact', () => {
    it('should change artifact', async () => {
      let newArtifactResult = await Artifacts.insertOne(fixtures.artifact3);
      const result = await to.delArtifact(newArtifactResult.insertedId.toString());
      let newArtifact = await Artifacts.findOne({ _id: newArtifactResult.insertedId });
      expect(newArtifact).to.be.null;
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newArtifactResult.insertedId);
    });
  });

});


after(async () => {
  mongod.stop();
});
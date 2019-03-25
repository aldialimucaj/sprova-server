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
const projectService = require('../../src/services/project.service');

let to;
let mongod;
let Projects;

const fixtures = require('./fixtures/project.fixture');


describe('project : service', () => {
  before(async () => {
    try {
      mongod = new MongoMemoryServer();
      config.db.port = await mongod.getPort();
      config.db.name = await mongod.getDbName()
      
      await dbm.connect(config);
      await projectService.load();
      to = projectService;
  
      Projects = await dbm.getCollection('projects');
      await Projects.deleteMany();
    } catch (e) {
      console.error(e)
    }
  });

  beforeEach(async () => {
    await Projects.insertMany(fixtures.initialObjects.map(x => { delete x._id; return x; }));
  });
  afterEach(async () => {
    await Projects.deleteMany();
  });

  describe('getProjects', () => {

    it('should return projects', async () => {
      const result = await to.getProjects();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.eql(fixtures.initialObjects[0]);
      expect(result[1]).to.eql(fixtures.initialObjects[1]);
    });

    it('should return limited projects', async () => {
      const result = await to.getProjects({}, { limit: 1 });
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    });
  });

  describe('getProject', () => {
    it('should return one project', async () => {
      const result = await to.getProject(fixtures.initialObjects[0]._id);
      expect(result).to.be.an('object');
      expect(result).to.eql(fixtures.initialObjects[0]);
    });
  });

  describe('postProjects', () => {
    it('should save project', async () => {
      const result = await to.postProject(fixtures.project1);
      expect(result).to.be.an('object');
      expect(result.title).to.be.eql(fixtures.project1.title);
      expect(result._id).to.not.be.undefined;
      const newProject = await Projects.findOne({ _id: result._id });
      expect(newProject.title).to.equal(fixtures.project1.title);
    });
  });

  describe('putProject', () => {
    it('should change project', async () => {
      const changes = { title: "test-project" };
      const newProjectResult = await Projects.insertOne(fixtures.project2);
      const result = await to.putProject(newProjectResult.insertedId, changes);
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newProjectResult.insertedId);
      const newProject = await Projects.findOne({ _id: newProjectResult.insertedId });
      expect(newProject).to.be.an('object');
      expect(newProject.title).to.equal(changes.title);
    });
  });

  describe('delProject', () => {
    it('should change project', async () => {
      let newProjectResult = await Projects.insertOne(fixtures.project3);
      const result = await to.delProject(newProjectResult.insertedId);
      let newProject = await Projects.findOne({ _id: newProjectResult.insertedId });
      expect(newProject).to.be.null;
      expect(result.ok).to.be.eql(1);
      expect(result._id).to.be.eql(newProjectResult.insertedId);
    });
  });

});


after(async () => {
  mongod.stop();
});
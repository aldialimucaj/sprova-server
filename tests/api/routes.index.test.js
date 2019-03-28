/* eslint-disable * */
/* eslint-disable max-lines-per-function */

var describe = require('mocha').describe;
var before = require('mocha').before;
var after = require('mocha').after;
var it = require('mocha').it;

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const { MongoMemoryServer } = require('mongodb-memory-server');

let config = { db: { host: 'localhost', name: 'sprova', port: 27027 } };
let mongod;

const dbm = require('../../src/helpers/db');
var server;

before('Setting up the system', async () => {
  chai.use(chaiHttp);
  try {
    mongod = await new MongoMemoryServer({
      instance: {
        port: 27027
      }
    });
    await mongod.getConnectionString();
    await dbm.connect(config);
    server = require('../../src/server');
  } catch (e) {
    console.error(e)
  }
});

describe('API Routes', () => {
  describe('ARTIFACTS', () => {
    describe('GET /artifacts', () => {
      var newModel;
      before('Set up artifacts', async () => {
        const Artifacts = await dbm.getCollection('artifacts');
        await Artifacts.deleteMany();
        newModel = await Artifacts.insertMany([
          { "artifact": 1 }, 
          { "artifact": 2 }
        ])
      })
      it('should return all artifacts', (done) => {
        chai.request(server)
          .get('/api/artifacts')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]._id).to.eql(newModel.ops['0']._id.toString());
            done();
          });
      });
    });
  });

  // ============================================================================

  describe('Cycles', () => {
    describe('GET /cycles', () => {
      let cycles;
      before('Set up cycles', async () => {
        const Cycles = await dbm.getCollection('cycles');
        await Cycles.deleteMany();
        const response = await Cycles.insertMany([
          { "cycles": 1 }, 
          { "cycles": 2 }
        ])
        cycles = response.ops;
      })
      it('should return all cycles', (done) => {
        chai.request(server)
          .get('/api/cycles')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]._id).to.eql(cycles[0]._id.toString());
            done();
          });
      });
    });
  });

  // ============================================================================  

  describe('PROJECTS', () => {
    describe('GET /projects', () => {
      var newModel;
      before('Set up projects', async () => {
        const Projects = await dbm.getCollection('projects');
        newModel = await Projects.insertMany([
          { "project": 1 }, 
          { "project": 2 }
        ])
      })
      it('should return all projects', (done) => {
        chai.request(server)
          .get('/api/projects')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]._id).to.eql(newModel.ops['0']._id.toString());
            done();
          });
      });
    });
  });

  // ============================================================================  

  describe('TEST CASES', () => {
    describe('GET /testcases', () => {
      var testCases;
      before('Set up testcases', async () => {
        const TestCases = await dbm.getCollection('testcases');
        await TestCases.deleteMany();
        const response = await TestCases.insertMany([
          { "testcase": 1 }, 
          { "testcase": 2 }
        ])
        testCases = response.ops;
      })
      it('should return all testcases', (done) => {
        chai.request(server)
          .get('/api/testcases')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]._id).to.eql(testCases[0]._id.toString());
            done();
          });
      });
    });
  });

  // ============================================================================  

  describe('USERS', () => {
    describe('GET /users', () => {
      var newUsers;
      before('Set up users', async () => {
        const Users = await dbm.getCollection('users');
        await Users.deleteMany();
        newUsers = await Users.insertMany([{ "user": 1 }, { "user": 2 }])
      })
      it('should return all users', (done) => {
        chai.request(server)
          .get('/api/users')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]._id).to.eql(newUsers.ops['0']._id.toString());
            done();
          });
      });
    });
    describe('GET /user/:id', () => {
      var newUsers;
      before('Set up users', async () => {
        const Users = await dbm.getCollection('users');
        await Users.deleteMany();
        newUsers = await Users.insertMany([{ "user": 1, "admin": true }, { "user": 2 }])
      })
      it('should return user 1', (done) => {
        const id = newUsers.ops['0']._id.toString();
        chai.request(server)
          .get('/api/users/' + id)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal(id);
            expect(res.body.admin).to.be.equal(true);
            done();
          });
      });
    });
  });
});

// ============================================================================
describe('Global', () => {
  describe('GET /status', () => {
    it('should return json', (done) => {
      chai.request(server)
        .get('/status')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.body.success.should.equal(true);
          done();
        });
    });
  });

});

after(async () => {
  mongod.stop();
  server.stop();
});
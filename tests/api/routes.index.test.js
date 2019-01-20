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

const DatabaseManager = require('../../src/helpers/db');
var db;
var server;

before('setting up the system', async () => {
  chai.use(chaiHttp);
  try {
    mongod = new MongoMemoryServer({
      instance: {
        port: 27027
      }
    });
    const databaseManager = new DatabaseManager(config)
    const uriStr = await mongod.getConnectionString();

    db = await databaseManager.connect();
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
        const Artifacts = db.collection('artifacts');
        await Artifacts.deleteMany();
        newModel = await Artifacts.insertMany([{ "artifact": 1 }, { "artifact": 2 }])
      })
      it('should return all artifacts', () => {
        chai.request(server)
          .get('/api/artifacts')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]._id).to.eql(newModel.ops['0']._id.toString());
          });
      });
    });
  });

  // ============================================================================  

  describe('PROJECTS', () => {
    describe('GET /projects', () => {
      var newModel;
      before('Set up projects', async () => {
        const Projects = db.collection('projects');
        await Projects.deleteMany();
        newModel = await Projects.insertMany([{ "project": 1 }, { "project": 2 }])
      })
      it('should return all projects', () => {
        chai.request(server)
          .get('/api/projects')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]._id).to.eql(newModel.ops['0']._id.toString());
          });
      });
    });
  });

  // ============================================================================  

  describe('TEST CASES', () => {
    describe('GET /testcases', () => {
      var newModel;
      before('Set up testcases', async () => {
        const TestCases = db.collection('testcases');
        await TestCases.deleteMany();
        newModel = await TestCases.insertMany([{ "testcase": 1 }, { "testcase": 2 }])
      })
      it('should return all testcases', () => {
        chai.request(server)
          .get('/api/testcases')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]._id).to.eql(newModel.ops['0']._id.toString());
          });
      });
    });
  });

  // ============================================================================  

  describe('USERS', () => {
    describe('GET /users', () => {
      var newUsers;
      before('Set up users', async () => {
        const Users = db.collection('users');
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
        const Users = db.collection('users');
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
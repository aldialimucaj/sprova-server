/* eslint-disable */
let config = { db: { host: '127.0.0.1' } };

// mocks
const { MongoMemoryServer } = require('mongodb-memory-server');

// tools
const chai = require('chai');
const expect = chai.expect;

// setup
const dbm = require('../../src/helpers/db');
const userService = require('../../src/services/user.service');

let to;
let mongod;
let Users;

// fixtures
const fixtures = require('./fixtures/user.fixture.json');
const fixture1 = [{ "test": 1 }, { "test": 2 }];
let fixture1Result;

// tests

describe('user : service', () => {

  before(async () => {
    try {
      mongod = new MongoMemoryServer();
      config.db.port = await mongod.getPort();
      config.db.name = await mongod.getDbName()

      await dbm.connect(config);
      await userService.load();
      to = userService;
  
      Users = await dbm.getCollection('users');
      fixture1Result = await Users.insertMany(fixture1)
    } catch (e) {
      console.error(e)
    }
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      const result = await to.getUsers({}, {});
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0].test).to.eql(1);
      expect(result[1].test).to.eql(2);
    });
    it('should return limited users', async () => {
      const result = await to.getUsers({}, { limit: 1 });
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
    });
  });

  describe('getUser', () => {
    it('should return one user', async () => {
      const result = await to.getUser(fixture1Result.insertedIds[0].toString());
      expect(result).to.be.an('object');

      expect(result).to.eql(fixture1[0]);
    });
  });

  describe('postUsers', () => {
    it('should save user', async () => {
      const result = await to.postUser(fixtures.user1);
      const _id = result._id;
      const newUser = await Users.findOne({ _id });

      expect(result).to.be.an('object');
      expect(result.ok).to.be.eql(1);
      expect(fixtures.user1.title).to.equal(newUser.title);
      expect(fixtures.user1.createdAt).to.not.be.undefined;
    });
  });

  describe('putUsers', () => {
    it('should change user', async () => {
      let newUserResult = await Users.insertOne(fixtures.user2);
      const changes = { username: "test-noput-user" };
      const result = await to.putUser(newUserResult.insertedId.toString(), changes);
      expect(result.ok).to.be.eql(1);
      let newUser = await Users.findOne({ _id: newUserResult.insertedId });
      expect(newUser).to.be.an('object');
      expect(newUser.username).to.equal(changes.username);
    });
  });
});


after((done) => {
  mongod.stop();
  done();
});
/* eslint-disable */
const _ = require('lodash');
let config = { db: { host: '127.0.0.1' } };

// mocks
const { MongoMemoryServer } = require('mongodb-memory-server');

// tools
const chai = require('chai');
const expect = chai.expect;

// setup
const DatabaseManager = require('../../src/helpers/db');
const ReportService = require('../../src/services/report.service');

let to;
let mongod;
let Reports, Projects, Cycles, TestCases, Executions;

// fixtures
const fixture1projects = [{ "project": 1 }, { "project": 2 }];
let fixture1projectsResult;
const fixture1cycles = [{ "cycle": 1 }, { "cycle": 2 }];
let fixture1cyclesResult;
const fixture1testcases = [{ "testcase": 1 }, { "testcase": 2 }, { "testcase": 3 }];
let fixture1testcasesResult;
const fixture1executions = [{ "execution": 1 }, { "execution": 2 }, { "execution": 3 }, { "execution": 4 }];
let fixture1executionsResult;

before(async () => {
  try {
    mongod = new MongoMemoryServer();
    const uriStr = await mongod.getConnectionString();
    config.db.port = await mongod.getPort();
    config.db.name = await mongod.getDbName();
    const databaseManager = new DatabaseManager(config);

    var db = await databaseManager.connect();
    to = new ReportService(db);
    Reports = db.collection('reports');
    Projects = db.collection('projects');
    Cycles = db.collection('cycles');
    TestCases = db.collection('testcases');
    Executions = db.collection('executions');
    fixture1projectsResult = await Projects.insertMany(fixture1projects);

    fixture1testcases[0].projectId = fixture1projectsResult.insertedIds[0];
    fixture1testcases[1].projectId = fixture1projectsResult.insertedIds[0];
    fixture1testcases[2].projectId = fixture1projectsResult.insertedIds[1];
    fixture1testcasesResult = await TestCases.insertMany(fixture1testcases);

        
    fixture1cycles[0].projectId = fixture1projectsResult.insertedIds[0];
    fixture1cycles[1].projectId = fixture1projectsResult.insertedIds[1];
    fixture1cycles[0].testCases = Object.values(fixture1testcasesResult.insertedIds);
    fixture1cyclesResult = await Cycles.insertMany(fixture1cycles);
    

    fixture1executions[0].testCaseId = fixture1testcasesResult.insertedIds[0];
    fixture1executions[0].cycleId = fixture1cyclesResult.insertedIds[0];
    fixture1executions[1].testCaseId = fixture1testcasesResult.insertedIds[0];
    fixture1executions[1].cycleId = fixture1cyclesResult.insertedIds[0];
    fixture1executions[2].testCaseId = fixture1testcasesResult.insertedIds[1];
    fixture1executions[2].cycleId = fixture1cyclesResult.insertedIds[0];
    fixture1executions[3].testCaseId = fixture1testcasesResult.insertedIds[1];
    fixture1executions[3].cycleId = fixture1cyclesResult.insertedIds[0];
    fixture1executionsResult = await TestCases.insertMany(fixture1executions);
  } catch (e) {
    console.error(e)
  }
});

// tests

describe('report : service', () => {

  describe('getProjectReport', () => {
    it('should return project reports', async () => {
      const result = await to.getProjectReport(fixture1projectsResult.insertedIds[0]);
      expect(result.project).to.not.be.undefined;
      expect(result.cycles).to.be.an('array');
      expect(result.cycles).to.have.lengthOf(1);
      expect(result.cycles[0]).to.eql(fixture1cycles[0]);
      expect(result.testCases).to.be.an('array');
      expect(result.testCases).to.have.lengthOf(2);
      expect(result.testCases[0]).to.eql(fixture1testcases[0]);
      expect(result.testCases[1]).to.eql(fixture1testcases[1]);

    });
  });

  describe('getCycleReport', () => {
    it('should return cycle report', async () => {
      const result = await to.getCycleReport(fixture1cyclesResult.insertedIds[0]);
      expect(result.cycle).to.not.be.undefined;
      expect(result.testCases).to.be.an('array');
      expect(result.testCases).to.have.lengthOf(3);
      expect(result.testCases[0]).to.eql(fixture1testcases[0]);
      expect(result.testCases[1]).to.eql(fixture1testcases[1]);
      expect(result.executions).to.be.an('array');
    });
  });

  describe('getTestSetReport', () => {
    it('should return test set report', async () => {
      const result = await to.getTestSetReport(fixture1cyclesResult.insertedIds[0]);
      expect(result).to.not.be.undefined;
    });
  });
});


after((done) => {
  mongod.stop();
  done();
});
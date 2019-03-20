const { ExecutionStatus, TestSetExecutionStatus } = require('../helpers/enums');
const dbm = require('../helpers/db');
const log = require('../helpers/log');
const { formatInsert, formatUpdate, formatDelete } = require('../helpers/utils');
const executionService = require('./execution.service');
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');

class TestSetExecutionService {

    async load() {
        this.TestSetsExecution = await dbm.getCollection('testset-executions');
        this.TestSets = await dbm.getCollection('testsets');
        this.TestCases = await dbm.getCollection('testcases');
        this.Executions = await dbm.getCollection('executions');
        log.info("Successfully loaded TestSetExecutionService");
    }

    async getTestSetExecutions(query, options) {
        return await this.TestSetsExecution.find(query, options).toArray();
    }

    async getTestSetExecution(id) {
        const _id = ObjectId(id);
        return await this.TestSetsExecution.findOne({ _id });
    }

    async delTestSetExecution(id) {
        const _id = ObjectId(id);
        const response = await this.TestSetsExecution.deleteOne({ _id });

        return formatDelete(response, _id);
    }

    /**
     * Update model
     * 
     * @param {*} id 
     * @param {*} value 
     */
    async putTestSetExecution(id, value) {
        const _id = ObjectId(id);

        // projectId comes in as string
        value.projectId = ObjectId(value.projectId)
        // cycleId comes in as string
        value.cycleId = ObjectId(value.cycleId)
        // parentId comes in as string
        if (value.parentId) {
            value.parentId = ObjectId(value.parentId)
        }
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        // updatedAt timestamp
        value.updatedAt = new Date();

        let response = await this.TestSetsExecution.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    /**
     * Create model from an existing test set.
     * Test set ID has to be referenced testSetId in order to link this document
     * with the test set. Also projectId and cycleId are required.
     * The new execution set will include all test cases in the linked test set.
     * These executions are set on a pending status and can be fetched by /next-pending
     * 
     * @param {*} value 
     */
    async postTestSetExecution(value) {
        // TODO: make possible to define own _id as it allows us to fetch through the URL
        delete value._id;

        value.testSetId = ObjectId(value.testSetId)
        value.projectId = ObjectId(value.projectId)
        value.cycleId = ObjectId(value.cycleId)

        // creation time
        value.createdAt = new Date();
        // startedAt -> when first test starts running
        // updated on every POST request
        // endedAt -> last test updated

        let response = await this.TestSetsExecution.insertOne(value);

        // create execution pool for this test set
        // new instances will be created forr all test belonging 
        // to this set will be marked as planned
        // and linked through the execution 
        let testSet = await this.TestSets.findOne({ _id: value.testSetId });
        if (!testSet) {
            throw new Error('Test Set ID is invalid');
        }

        let testCases = await this.TestCases.find({ _id: { $in: testSet.testCases } }).toArray();
        let orderedTestCases = this.reinfoceOrder(testCases, testSet.testCases);
        let executions = orderedTestCases.map(testCase => executionService.createExecution(value.user, testCase, value.cycleId, response.insertedId));
        await this.Executions.insertMany(executions);

        return formatInsert(response);
    }

    /**
    * Search in test set executions
    * 
    * @param {*} value query and options value { query, options }
    */
    async findTestSetExecutions(value) {
        const { query, options } = value;

        if (query) {
            if (query.projectId) {
                query.projectId = ObjectId(query.projectId);
            }
            if (query.cycleId) {
                query.cycleId = ObjectId(query.cycleId);
            }
            if (query.testSetId) {
                query.testSetId = ObjectId(query.testSetId);
            }
        }

        return await this.TestSetsExecution.find(query, options).toArray();
    }

    /* ************************************************************************* */
    /*                                 CUSTOM                                    */
    /* ************************************************************************* */

    /**
     * Helper function to fetch the next text that is to be executed.
     * 
     * @param {*} id testSetExecution ID
     */
    async getNextPendingTest(id) {
        var result;
        const _id = ObjectId(id);

        result = await this.Executions.findOne({ testSetExecutionId: _id, status: ExecutionStatus.Pending });
        if (result) {
            var update = await this.Executions.updateOne({ _id: result._id }, { $set: { status: ExecutionStatus.Working } });
            if (update.result.ok) {
                result.status = ExecutionStatus.Working;
            }
        } else {
            await this.TestSetsExecution.updateOne({ _id }, { $set: { status: TestSetExecutionStatus.Finished } });
        }

        return result;
    }

    /**
     * Helper function to fetch the next text that is to be executed.
     * 
     * @param {*} id testSetExecution ID
     */
    async hasPendingTest(id) {
        let result = {}
        const _id = ObjectId(id);

        let nextTest = await this.Executions.findOne({ testSetExecutionId: _id, status: ExecutionStatus.Pending });
        // no errors. query was successful
        result.ok = 1;

        // if it has a next pending test, then return its id
        if (nextTest) {
            result._id = nextTest._id;
        }

        return result;
    }

    /**
     * Make sure the order of the testcases it the one specified in the test set
     * 
     * @param {Array} testCases array test case objects
     * @param {Array} testCaseIds array of ObjectId
     */
    reinfoceOrder(testCases, testCaseIds) {
        let result = [];
        for (let _id of testCaseIds) {
            const testCaseId = _.find(testCases, { _id });
            if(testCaseId) {
                result.push(testCaseId);
            }
        }
        return result;
    }
}

module.exports = new TestSetExecutionService();
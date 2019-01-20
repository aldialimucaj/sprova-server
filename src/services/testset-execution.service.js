const { ExecutionStatus, TestSetExecutionStatus } = require('../helpers/enums');
const { formatInsert, formatUpdate, formatRemove } = require('../helpers/utils');
const ExecutionService = require('./execution.service');
const ObjectId = require('mongodb').ObjectId;
var TestSetsExecution = undefined;
var TestSets = undefined;
var TestCases = undefined;
var Executions = undefined;

class TestSetExecutionService {

    constructor(db) {
        TestSetsExecution = db.collection('testset-executions');
        TestSets = db.collection('testsets');
        TestCases = db.collection('testcases');
        Executions = db.collection('executions');
    }

    // ============================================================================

    async getTestSetExecutions(query, options) {
        return await TestSetsExecution.find(query, options).toArray();
    }

    async getTestSetExecution(id) {
        const _id = ObjectId(id);
        return await TestSetsExecution.findOne({ _id });
    }

    // ============================================================================

    async delTestSetExecution(id) {
        const _id = ObjectId(id);
        const response = await TestSetsExecution.remove({ _id });

        return formatRemove(response, _id);
    }

    // ============================================================================

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

        let response = await TestSetsExecution.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    // ============================================================================

    /**
     * Create model from an existing test set.
     * Test set ID has to be referenced testSetId in order to link this document
     * with the test set. Also projectId and cycleId are required.
     * The new execution set will include all test cases in the linked test set.
     * These executions are set on a pending status and can be fetched by /next-pending
     * 
     * @param {*} ctx 
     * @param {*} next 
     */
    async postTestSetExecution(value, user) {
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

        let response = await TestSetsExecution.insertOne(value);

        // create execution pool for this test set
        // new instances will be created forr all test belonging 
        // to this set will be marked as planned
        // and linked through the execution 
        let testSet = await TestSets.findOne({ _id: value.testSetId });
        if (!testSet) {
            throw new Error('Test Set ID is invalide');
        }

        let testCases = await TestCases.find({ _id: { $in: testSet.testCases } }).toArray();
        let executions = testCases.map(testCase => ExecutionService.createExecution(user, testCase, value.cycleId, response._id));
        await Executions.insertMany(executions);

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

        return await TestSetsExecution.find(query, options).toArray();
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

        result = await Executions.findOne({ executionSetId: _id, status: ExecutionStatus.Pending });
        await Executions.updateOne({ _id: result._id }, { $set: { status: ExecutionStatus.Working } });
        if (!result) {
            await TestSetsExecution.updateOne({ _id }, { $set: { status: TestSetExecutionStatus.Finished } });
        }

        return result;
    }
}

module.exports = TestSetExecutionService;
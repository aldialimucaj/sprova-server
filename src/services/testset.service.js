const ObjectId = require('mongodb').ObjectId;
const dbm = require('../helpers/db');
const { formatInsert, formatUpdate, formatDelete } = require('../helpers/utils');

class TestSetService {

    constructor() {
        this.TestSets = dbm.getCollection('testsets');
        this.TestCases = dbm.getCollection('testcases');
        this.TestSetsExecution = dbm.getCollection('testset-executions');
    }

    async getTestSets(query, options) {
        return await this.TestSets.find(query, options).toArray();
    }

    async getTestSet(id) {
        const _id = ObjectId(id);
        return await this.TestSets.findOne({ _id });
    }

    async getTestSetTestCases(id) {
        let result;
        const _id = ObjectId(id);

        let testSet = await this.TestSets.findOne({ _id });
        if (testSet.testCases) {
            result = await this.TestCases.find({ _id: { $in: testSet.testCases } }).toArray();
        } else {
            result = [];
        }

        return result;
    }

    async getTestSetTestSetExecutions(id) {
        const _id = ObjectId(id);

        return await this.TestSetsExecution.find({ testSetId: _id }).toArray();
    }

    async delTestSet(id) {
        const _id = ObjectId(id);
        const response = await this.TestSets.deleteOne({ _id });

        return formatDelete(response, _id);
    }

    /**
     * Update model
     * 
     * @param {*} id
     * @param {*} value
     */
    async putTestSet(id, value) {
        const _id = ObjectId(id);

        // projectId comes in as string
        value.projectId = ObjectId(value.projectId)
        // cycleId comes in as string
        value.cycleId = ObjectId(value.cycleId)
        // parentId comes in as string
        if (value.parentId) {
            value.parentId = ObjectId(value.parentId)
        }
        if (value.testCases) {
            value.testCases = value.testCases.map(t => ObjectId(t));
        }
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        value.updatedAt = new Date();

        let response = await this.TestSets.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    /**
     * Create model
     * 
     * @param {*} value
     */
    async postTestSet(value) {
        // TODO: make possible to define own _id as it allows us to fetch through the URL
        delete value._id;
        // projectId comes in as string

        value.createdAt = new Date();
        value.updatedAt = new Date();

        value.projectId = ObjectId(value.projectId)
        value.cycleId = ObjectId(value.cycleId)
        if (value.testCases) {
            value.testCases = value.testCases.map(t => ObjectId(t));
        }

        let response = await this.TestSets.insertOne(value);

        return formatInsert(response);
    }

    async findTestSets(value) {
        let query = {};
        let options = {};
        if (value && value.query) {

            query = value.query;
            if (query.projectId) {
                query.projectId = ObjectId(query.projectId);
            }
            if (query.cycleId) {
                query.cycleId = ObjectId(query.cycleId);
            }
        }
        if (value && value.options) {
            //TODO sanitize options
            options = value.options;
        }

        return await this.TestSets.find(query, options).toArray();
    }
}

module.exports = new TestSetService();
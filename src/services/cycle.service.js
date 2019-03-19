const ObjectId = require('mongodb').ObjectId;
const dbm = require('../helpers/db');
const { formatInsert, formatUpdate, formatDelete } = require('../helpers/utils');

class CycleService {

    constructor() {
        this.Cycles = dbm.getCollection('cycles');
        this.TestSets = dbm.getCollection('testsets');
        this.TestCases = dbm.getCollection('testcases');
        this.Executions = dbm.getCollection('executions');
    }

    async getCycles(query, options) {
        return await this.Cycles.find(query, options).toArray();
    }

    async getCycle(id) {
        const _id = ObjectId(id);

        return await this.Cycles.findOne({ _id });
    }

    async getCycleTestCases(cycleId, query, options) {
        const _id = ObjectId(cycleId);
        let cycle = await this.Cycles.findOne({ _id });
        const extraQuery = Object.assign(query, { _id: { $in: cycle.testCases } });

        return await this.TestCases.find(extraQuery, options).toArray();
    }

    /**
     * Fetch test case statistics about executions
     * 
     * @param {*} cycleId 
     */
    async getTestCasesStats(cycleId, query, options) {
        var result;
        const _id = ObjectId(cycleId);

        try {
            var cycle = await this.Cycles.findOne({ _id });
            const testCasesIds = cycle.testCases.map(tc => ObjectId(tc));
            const extraQuery = Object.assign(query, { _id: { $in: testCasesIds } });
            var testCases = await this.TestCases.find(extraQuery, options).toArray();
            await Promise.all(testCases.map(async tc => {
                tc.executionsStats = await this.Executions.aggregate([
                    {
                        $match: { testCaseId: tc._id, cycleId: _id }
                    },
                    { $group: { _id: "$status", total: { $sum: 1 } } },
                    { $sort: { _id: -1 } }
                ]).toArray();
            }));
            result = testCases;
        } catch (e) {
            result = e;
        }

        return result;
    }

    /**
     * Update model
     * 
     * @param {*} id 
     * @param {*} value 
     */
    async putCycle(id, value) {
        const _id = ObjectId(id);

        // projectId comes in as string
        value.projectId = ObjectId(value.projectId)
        value.updatedAt = new Date();

        if (value.testCases) {
            value.testCases = value.testCases.map(t => ObjectId(t));
        }
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        const result = await this.Cycles.updateOne({ _id }, { $set: value });

        return formatUpdate(result, _id);
    }

    /**
     * Create model
     * 
     * @param {*} value
     */
    async postCycle(value) {
        // TODO: make possible to define own _id as it allows us to fetch through the URL
        delete value._id;
        // projectId comes in as string
        value.projectId = ObjectId(value.projectId)
        if (value.testCases) {
            value.testCases = value.testCases.map(t => ObjectId(t));
        }

        value.createdAt = new Date();
        value.updatedAt = new Date();

        const result = await this.Cycles.insertOne(value);

        return formatInsert(result);
    }

    /**
     * Search for cycles by defining query values that are passed to cycles.find()
     * 
     * @param {*} query query values
     */
    async findCycles(query) {


        return await this.Cycles.find(query).toArray();
    }

    /**
     * Find cycle test cases by applying query values to testcases.find();
     * 
     * @param {*} id cycle ID
     * @param {*} value query object must set like { query: { title:"test" }, options : { limit: 10 } }
     * @param {*} options query options
     */
    async findOneCycleTestCases(id, query, options) {
        const _id = ObjectId(id);
        const cycle = await this.Cycles.findOne({ _id });
        const result = await this.TestCases.find({ _id: { $in: cycle.testCases }, ...query }, options).toArray();
        return result;
    }

    /**
     * Find single cycle with its according test cases
     * 
     * @param {*} id cycle ID
     * @param {*} value query object must set like { query: { title:"test" }}
     */
    async findOneCycleTestCase(id, query) {
        const _id = ObjectId(id);
        const cycle = await this.Cycles.findOne({ _id });
        const result = await this.TestCases.findOne({ _id: { $in: cycle.testCases }, ...query })
        return result;
    }

    /**
     * Find single test set belonging to cycle
     * 
     * @param {*} id cycle ID
     * @param {*} value test set query
     */
    async findOneCycleTestSet(id, value) {
        const _id = ObjectId(id);
        var query = {}
        if (value && value.query) {
            query = Object.assign({}, value.query);
            if (query.projectId) {
                query.projectId = ObjectId(query.projectId);
            }
        }

        query.cycleId = _id;
        return await this.TestSets.findOne(query);
    }

    async delCycle(id) {
        const _id = ObjectId(id);
        const response = await this.Cycles.deleteOne({ _id });

        return formatDelete(response, _id);
    }

}

module.exports = new CycleService();
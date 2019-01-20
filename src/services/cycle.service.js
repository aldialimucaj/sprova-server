const ObjectId = require('mongodb').ObjectId;
const { formatInsert, formatUpdate, formatRemove } = require('../helpers/utils');
var Cycles = undefined;
var TestSets = undefined;
var TestCases = undefined;
var Executions = undefined;

class CycleService {

    constructor(db) {
        Cycles = db.collection('cycles');
        TestSets = db.collection('testsets');
        TestCases = db.collection('testcases');
        Executions = db.collection('executions');
    }

    // ============================================================================

    async getCycles(query, options) {
        return await Cycles.find(query, options).toArray();
    }

    async getCycle(id) {
        const _id = ObjectId(id);

        return await Cycles.findOne({ _id });
    }

    async getCycleTestCases(id) {
        const _id = ObjectId(id);

        let cycle = await Cycles.findOne({ _id });
        return await TestCases.find({ _id: { $in: cycle.testCases } }).toArray();
    }

    /**
     * Fetch test case statistics about executions
     * 
     * @param {*} id 
     */
    async getTestCaseStats(id) {
        var result;
        const _id = ObjectId(id);

        try {
            var cycle = await Cycles.findOne({ _id });
            const testCasesIds = cycle.testCases.map(tc => ObjectId(tc));
            var testCases = await TestCases.find({ _id: { $in: testCasesIds } }).toArray();
            await Promise.all(testCases.map(async tc => {
                tc.executionsStats = await Executions.aggregate([
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

    // ============================================================================
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

        const result = await Cycles.updateOne({ _id }, { $set: value });

        return formatUpdate(result, _id);
    }

    // ============================================================================

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

        const result = await Cycles.insertOne(value);

        return formatInsert(result);
    }

    /**
     * Search for cycles by defining filter values that are passed to cycles.find()
     * 
     * @param {*} value filter values
     */
    async findCycles(value) {
        var filter = {}
        if (value && value.filter) {
            filter = value.filter;
            if (filter.projectId) {
                filter.projectId = ObjectId(filter.projectId);
            }
        }

        return await Cycles.find(filter).toArray();
    }

    /**
     * Find cycle test cases by applying filter values to testcases.find();
     * 
     * @param {*} id cycle ID
     * @param {*} value filter object must set like { filter: { title:"test" }, options : { limit: 10 } }
     */
    async findCycleTestCases(id, value) {
        const _id = ObjectId(id);

        let filter = {};
        let options = {};

        if (value && value.filter) {
            filter = value.filter;
            if (filter.projectId) {
                filter.projectId = ObjectId(filter.projectId);
            }
        }

        if (value && value.options) {
            //TODO sanitize options
            options = value.options;
        }

        let cycle = await Cycles.findOne({ _id });
        filter._id = { $in: cycle.testCases }

        return await TestCases.find(filter, options).toArray();
    }


    /**
     * Find single cycle with its according test cases
     * 
     * @param {*} id cycle ID
     * @param {*} value filter object must set like { filter: { title:"test" }}
     */
    async findOneCycleTestCase(id, value) {
        const _id = ObjectId(id);

        var filter = {}
        if (value && value.filter) {
            filter = Object.assign({}, value.filter);
            if (filter.projectId) {
                filter.projectId = ObjectId(filter.projectId);
            }
        }

        let cycle = await Cycles.findOne({ _id });
        filter._id = { $in: cycle.testCases }

        return await TestCases.findOne(filter);
    }

    /**
     * Find test sets belonging to cycle.
     * 
     * @param {*} id cycle ID
     * @param {*} value test set filter
     */
    async findCycleTestSets(id, value) {
        const _id = ObjectId(id);
        var filter = {}
        if (value && value.filter) {
            filter = value.filter;
            if (filter.projectId) {
                filter.projectId = ObjectId(filter.projectId);
            }
        }

        filter.cycleId = _id;

        return await TestSets.find(filter).toArray();
    }

    /**
     * Find single test set belonging to cycle
     * 
     * @param {*} id cycle ID
     * @param {*} value test set filter
     */
    async findOneCycleTestSet(id, value) {
        const _id = ObjectId(id);
        var filter = {}
        if (value && value.filter) {
            filter = Object.assign({}, value.filter);
            if (filter.projectId) {
                filter.projectId = ObjectId(filter.projectId);
            }
        }

        filter.cycleId = _id;
        return await TestSets.findOne(filter);
    }


    // ============================================================================

    async delCycle(id) {
        const _id = ObjectId(id);
        const response = await Cycles.remove({ _id });

        return formatRemove(response, _id);
    }

}

module.exports = CycleService;
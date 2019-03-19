const ObjectId = require('mongodb').ObjectId;
const dbm = require('../helpers/db');

class ReportService {
    
    constructor() {
        this.Projects = dbm.getCollection('projects');
        this.Cycles = dbm.getCollection('cycles');
        this.TestSets = dbm.getCollection('testsets');
        this.TestCases = dbm.getCollection('testcases');
        this.Executions = dbm.getCollection('executions');
    }

    /**
     * Return project's relevant data for building a project report
     * 
     * @param {*} id project ID
     */
    async getProjectReport(id) {
        let result = {};
        const _id = ObjectId(id);

        let project = await this.Projects.findOne({ _id });
        result.project = project;

        let cycles = await this.Cycles.find({ projectId: _id }).toArray();
        result.cycles = cycles;

        let testCases = await this.TestCases.find({ projectId: _id }).toArray();
        result.testCases = testCases;

        return result;
    }

    /**
     * Return cycle's relevat data for building a cycle report
     * 
     * @param {*} id cycle ID
     */
    async getCycleReport(id) {
        let result = {};

        const _id = ObjectId(id);
        let cycle = await this.Cycles.findOne({ _id });
        result.cycle = cycle;

        let testsets = await this.TestSets.find({ cycleId: _id }).toArray();
        result.testsets = testsets;


        let testCases = await this.TestCases.find({ _id: { $in: cycle.testCases } }).toArray();
        result.testCases = testCases;

        var executionIds = await this.Executions.aggregate(
            {
                $match: { cycleId: _id }
            },
            {
                $sort: { updatedAt: -1 }
            },
            {
                $group: {
                    _id: "$testCaseId",
                    lastExecDate: { $last: "$updatedAt" },
                    executionId: { $push: "$_id" }
                }
            },
            {
                $project: {
                    _id: {
                        $arrayElemAt: [
                            "$executionId",
                            0
                        ]
                    }
                }
            },
            {
            }
        ).toArray();
        let idsArray = executionIds.map(e => e._id);
        let executions = await this.Executions.find({ _id: { $in: idsArray } }).toArray();
        result.executions = executions;

        return result;
    }

    async getTestSetReport(id) {
        // const _id = ObjectId(id);
        return { id, message: "not yet implemented" };
    }
}

module.exports = new ReportService();
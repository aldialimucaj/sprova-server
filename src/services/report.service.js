const ObjectId = require('mongodb').ObjectId;
var Projects = undefined;
var Cycles = undefined;
var TestSets = undefined;
var TestCases = undefined;
var Executions = undefined;

class ReportService {
    constructor(db) {

        Projects = db.collection('projects');
        Cycles = db.collection('cycles');
        TestSets = db.collection('testsets');
        TestCases = db.collection('testcases');
        Executions = db.collection('executions');
    }

    // ============================================================================

    /**
     * Return project's relevant data for building a project report
     * 
     * @param {*} id project ID
     */
    async getProjectReport(id) {
        let result = {};
        const _id = ObjectId(id);

        let project = await Projects.findOne({ _id });
        result.project = project;

        let cycles = await Cycles.find({ projectId: _id }).toArray();
        result.cycles = cycles;

        let testCases = await TestCases.find({ projectId: _id }).toArray();
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
        let cycle = await Cycles.findOne({ _id });
        result.cycle = cycle;

        let testsets = await TestSets.find({ cycleId: _id }).toArray();
        result.testsets = testsets;


        let testCases = await TestCases.find({ _id: { $in: cycle.testCases } }).toArray();
        result.testCases = testCases;

        var executionIds = await Executions.aggregate(
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
        let executions = await Executions.find({ _id: { $in: idsArray } }).toArray();
        result.executions = executions;

        return result;
    }

    async getTestSetReport(id) {
        // const _id = ObjectId(id);
        return { id, message: "not yet implemented" };
    }
}

module.exports = ReportService;
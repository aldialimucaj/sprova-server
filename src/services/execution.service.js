const ObjectId = require('mongodb').ObjectId;
const utils = require('../helpers/utils');
const { ExecutionStatus, ExecutionType, ArtifactType } = require('../helpers/enums');
const { formatInsert, formatUpdate, formatRemove } = require('../helpers/utils');

var Executions = undefined;
var Artifacts = undefined;
var Cycles = undefined;
var TestCases = undefined;


class ExecutionService {

    constructor(db) {
        Executions = db.collection('executions');
        Cycles = db.collection('cycles');
        TestCases = db.collection('testcases');
        Artifacts = db.collection('artifacts');
    }

    // ============================================================================

    async getExecutions(query, options) {
        return await Executions.find(query, options).toArray();
    }

    async getExecution(id) {
        const _id = ObjectId(id);

        return await Executions.findOne({ _id });
    }

    // ============================================================================

    /**
     * Update model
     * 
     * @param {*} id  Execution ID
     * @param {*} value update execution model. if empty then execution is resetted
     * @param {*} user user taking this action. cannot go to value because emty value == reset
     */
    async putExecution(id, value, user) {
        var response = {};
        const _id = ObjectId(id);

        // if there is no body, then this is a RESET action
        if (!value || Object.keys(value).length === 0) {
            response = await this.resetExecution(id, user);
        } else {
            // make sure not to change constant properties
            delete value._id;
            delete value.cycleId;
            delete value.testCaseId;
            delete value.testSetExecutionId;
            delete value.createdAt;

            value.updatedAt = new Date();

            response = await Executions.updateOne({ _id }, { $set: value });
        }

        return formatUpdate(response, _id);
    }

    async putExecutionStatus(id, value) {
        const _id = ObjectId(id);
        const status = value.status;
        const user = value.user;

        const response = await Executions.updateOne({ _id }, { $set: { status, user } });

        return formatUpdate(response, _id);
    }

    /**
     * Update specific step. This includes the stauts and other attribues like comments etc.
     * 
     * @param {*} id Execution ID
     * @param {*} stepIdx Step index in array
     * @param {*} value New step value.  ie. { comment: "not available", status: "WORKING"}
     */
    async putStepUpdate(id, stepIdx, value) {
        //TODO: make sure it is an execution with the specified format
        const _id = ObjectId(id);
        const testStep = `testSteps.${stepIdx}`;

        const response = await Executions.updateOne({ _id }, { $set: { [testStep]: value, updatedAt: new Date() } });

        return formatUpdate(response, _id);
    }

    /**
     * Update specific step status
     * 
     * @param {*} id Execution ID
     * @param {*} stepIdx Step index in array
     * @param {*} value New status value. Has only one parameter status. ie. { status: "WORKING"}
     */
    async putStepStatus(id, stepIdx, value) {
        const _id = ObjectId(id);
        const testStepsStatus = `testSteps.${stepIdx}.status`;
        const status = value.status;

        const response = await Executions.updateOne({ _id }, { $set: { [testStepsStatus]: status, updatedAt: new Date() } });

        return formatUpdate(response, _id);
    }


    /**
     * Update execution with artifacts generated from it
     * 
     * @param {String} id Execution id
     * @param {*} value files object { files: [] }
     */
    async putStepUpdateArtifact(id, stepIdx, value) {
        var result = { files: [] };
        const _id = ObjectId(id);
        try {
            const execution = await Executions.findOne({ _id });
            const cycle = await Cycles.findOne({ _id: execution.cycleId });
            const artifactsPath = utils.executionToPath(execution, cycle.projectId);

            const files = value.files || {};
            for (let file of files) {
                const filePath = utils.saveArtifact(file, artifactsPath);
                const artifact = { title: file.name, filestype: ArtifactType.Execution, executionId: execution._id, filePath, cycleId: execution.cycleId }
                artifact.createdAt = new Date();
                artifact.updatedAt = new Date();

                const artifactResult = await Artifacts.insertOne(artifact);
                result.ok = 1;
                result.files.push({ _id: artifactResult.insertedId, filename: file.name, filePath, success: true });
            }
        } catch (e) {
            result = e;
            result.ok = 0;
        }

        return result;
    }

    // ============================================================================
    /**
     * Create new execution object.
     * 
     * @param {*} value 
     * @param {*} user 
     * @param {boolean} returnDocument should return created document in data property
     */
    async postExecution(value, user, returnDocument) {
        // precondictions
        if (!value.cycleId) {
            throw new Error("New execution should be likened to a specific cycle");
        }
        if (!value.testCaseId) {
            throw new Error("New execution should be likened to a specific test case");
        }


        const cycleId = ObjectId(value.cycleId);
        const testCaseId = ObjectId(value.testCaseId);
        let testSetExecutionId;

        // executions can be optionaly started from an execution set
        if (value.testSetExecutionId) {
            testSetExecutionId = ObjectId(value.testSetExecutionId);
        }

        const testCase = await TestCases.findOne({ _id: testCaseId });
        if (!testCase) {
            throw new Error(`TestCase with ID ${testCaseId} does not exist. Cannot create execution.`);
        }
        const execution = ExecutionService.createExecution(user, testCase, cycleId, testSetExecutionId);
        // status is optional as it ca be working or pending:default
        if (value.status) {
            execution.status = value.status;
        }

        const response = await Executions.insertOne(execution);

        // we allso return the newly created execution
        const result = formatInsert(response);

        if (returnDocument) {
            result.data = execution;
        }

        return result;
    }

    /**
     * Find executions by applying filter values to executions.find();
     * 
     * @param {*} value filter object must set like { filter: { title:"test" }, options : { limit: 10 } }
     */
    async findExecutions(value) {
        let filter = {};
        let options = {};

        if (value && value.filter) {
            filter = value.filter;
            if (filter.projectId) {
                filter.projectId = ObjectId(filter.projectId);
            }
            if (filter.cycleId) {
                filter.cycleId = ObjectId(filter.cycleId);
            }
            if (filter.testCaseId) {
                filter.testCaseId = ObjectId(filter.testCaseId);
            }
            if (filter.testSetExecutionId) {
                filter.testSetExecutionId = ObjectId(filter.testSetExecutionId);
            }
        }

        if (value && value.options) {
            //TODO sanitize options
            options = value.options;
        }

        return await Executions.find(filter, options).toArray();
    }

    // ============================================================================

    /**
     * Remove execution
     * 
     * @param {*} id Execution ID
     */
    async delExecution(id) {
        const _id = ObjectId(id);
        const response = await Executions.remove({ _id });

        return formatRemove(response, _id);
    }

    /* ************************************************************************* */
    /*                                 NON PUBLIC                                */
    /* ************************************************************************* */


    /**
     * Create execution object
     * 
     * @param {*} user 
     * @param {*} testCase 
     * @param {*} cycleId 
     * @param {*} testSetId 
     */
    static createExecution(user, testCase, cycleId, testSetExecutionId) {
        const execution = {
            status: ExecutionStatus.Pending,
            executionType: ExecutionType.Manual,

            testCaseId: testCase._id,
            title: testCase.title,
            description: testCase.description,
            testSteps: testCase.testSteps.slice(0).map(t => {
                delete t.artifacts;
                return t;
            }),

            testSetExecutionId,
            cycleId,

            createdAt: new Date(),
            updatedAt: new Date(),
            user
        };

        return execution;
    }

    /**
     * Reset execution to default status.
     * This includes overriding the original executor and reseting the test steps 
     * and execution status. Also timestamps are updated.
     * 
     * @param {String} id Execution ID
     * @param {User} user User taking this action
     */
    async resetExecution(id, user) {
        const _id = ObjectId(id);
        let execution = await Executions.findOne({ _id });
        let testCase = await TestCases.findOne({ _id: execution.testCaseId });

        if (!testCase) {
            throw new Error(`No test case with ObjectId('${execution.testCaseId}') for executionId = ObjectId('${_id}')`);
        }

        // reset test steps
        if (!testCase.testSteps) {
            execution.testSteps = [];
        } else {
            // copy test steps form test case
            execution.testSteps = testCase.testSteps.slice(0);
        }

        // fingerprinting
        execution.status = ExecutionStatus.Pending;
        execution.updatedAt = new Date();
        execution.startedAt = null;
        execution.finishedAt = null;
        execution.user = user;

        return await Executions.updateOne({ _id }, { $set: execution });
    }
}

module.exports = ExecutionService;
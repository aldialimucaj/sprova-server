const ObjectId = require('mongodb').ObjectId;
const dbm = require('../helpers/db');
const log = require('../helpers/log');
const { ExecutionStatus, ExecutionType, ArtifactType } = require('../helpers/enums');
const { formatInsert, formatUpdate, formatDelete } = require('../helpers/utils');
const artifactService = require('./artifact.service');

class ExecutionService {

    async load() {
        this.Executions = await dbm.getCollection('executions');
        this.TestCases = await dbm.getCollection('testcases');
        log.info("Successfully loaded ExecutionService");
    }

    async getExecutions(query, options) {
        return await this.Executions.find(query, options).toArray();
    }

    async getExecution(id) {
        const _id = ObjectId(id);

        return await this.Executions.findOne({ _id });
    }

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

            response = await this.Executions.updateOne({ _id }, { $set: value });
        }

        return formatUpdate(response, _id);
    }

    async putExecutionStatus(id, value) {
        const _id = ObjectId(id);
        const status = value.status;
        const user = value.user;

        const response = await this.Executions.updateOne({ _id }, { $set: { status, user } });

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

        const response = await this.Executions.updateOne({ _id }, { $set: { [testStep]: value, updatedAt: new Date() } });

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

        const response = await this.Executions.updateOne({ _id }, { $set: { [testStepsStatus]: status, updatedAt: new Date() } });

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
            const execution = await this.Executions.findOne({ _id });

            const files = value.files || [];
            for (let file of Object.values(files)) {
                const artifactValue = { artifactType: ArtifactType.Execution, stepIdx, executionId: execution._id, cycleId: execution.cycleId }
                const artifactResult = await artifactService.postArtifact(artifactValue, file);

                result.ok = 1;
                result.files.push({ _id: artifactResult._id, filename: file.name, success: true });
            }
        } catch (e) {
            result = e;
            result.ok = 0;
        }

        return result;
    }

    /**
     * Create new execution object.
     * 
     * @param {*} value 
     * @param {*} user 
     * @param {boolean} returnDocument should return created document in data property
     */
    async postExecution(value) {
        log.info(value);
        if (value.isArray) {
            log.info('is array');
            const response = await this.Executions.insertMany(value);
            return formatInsert(response);
        } else {
            log.info('is not array');
            const response = await this.Executions.insertOne(value);
            return formatInsert(response);

        }
    }

    /**
     * Create new execution object.
     * 
     * @param {*} value 
     * @param {*} user 
     * @param {boolean} returnDocument should return created document in data property
     */
    async postExecutions(value, user, returnDocument) {
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

        const testCase = await this.TestCases.findOne({ _id: testCaseId });
        if (!testCase) {
            throw new Error(`TestCase with ID ${testCaseId} does not exist. Cannot create execution.`);
        }
        const execution = this.createExecution(user, testCase, cycleId, testSetExecutionId);
        // status is optional as it ca be working or pending:default
        if (value.status) {
            execution.status = value.status;
        }

        const response = await this.Executions.insertOne(execution);

        // we allso return the newly created execution
        const result = formatInsert(response);

        if (returnDocument) {
            result.data = execution;
        }

        return result;
    }

    /**
     * Find executions by applying query values to executions.find();
     * 
     * @param {*} query query object must set like { query: { title:"test" }, options : { limit: 10 } }
     * @param {*} options query options like limit and skip
     */
    async findExecutions(query, options) {
        return await this.Executions.find(query, options).toArray();
    }

    /**
     * Remove execution
     * 
     * @param {*} id Execution ID
     */
    async delExecution(id) {
        const _id = ObjectId(id);
        const response = await this.Executions.deleteOne({ _id });

        return formatDelete(response, _id);
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
    createExecution(user, testCase, cycleId, testSetExecutionId) {
        const execution = {
            status: ExecutionStatus.Pending,
            executionType: ExecutionType.Manual,

            testCaseId: testCase._id,
            title: testCase.title,
            description: testCase.description,
            testSteps: testCase.testSteps.slice(0),

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
        let execution = await this.Executions.findOne({ _id });
        let testCase = await this.TestCases.findOne({ _id: execution.testCaseId });

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

        return await this.Executions.updateOne({ _id }, { $set: execution });
    }
}

module.exports = new ExecutionService();
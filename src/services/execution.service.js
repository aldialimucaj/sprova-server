const ObjectId = require('mongodb').ObjectId;
const dbm = require('../helpers/db');
const log = require('../helpers/log');
const { ArtifactType } = require('../helpers/enums');
const { formatUpdate, formatDelete } = require('../helpers/utils');
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

    async getExecution(_id) {
        return await this.Executions.findOne({ _id });
    }

    /**
     * Update model
     * 
     * @param {*} id  Execution ID
     * @param {*} value update execution model. if empty then execution is resetted
     * @param {*} user user taking this action. cannot go to value because emty value == reset
     */
    async putExecution(_id, value, user) {
        var response = {};

        // if there is no body, then this is a RESET action
        if (!value || Object.keys(value).length === 0) {
            response = await this.resetExecution(_id, user);
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

    async postExecution(value) {
        const response = await this.Executions.insertOne(value);
        return response.ops[0];
    }

    async postExecutions(value) {
        const response = await this.Executions.insertMany(value);
        return response.ops;
    }

    async delExecution(_id) {
        const response = await this.Executions.deleteOne({ _id });
        return formatDelete(response, _id);
    }

}

module.exports = new ExecutionService();
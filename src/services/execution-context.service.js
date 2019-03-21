const dbm = require('../helpers/db');
const log = require('../helpers/log');
const { formatInsert, formatUpdate, formatDelete } = require('../helpers/utils');
const ObjectId = require('mongodb').ObjectId;

class ExecutionContextService {

    async load() {
        this.ExecutionContexts = await dbm.getCollection('execution-contexts');
        
        this.TestSets = await dbm.getCollection('testsets');
        this.TestCases = await dbm.getCollection('testcases');
        this.Executions = await dbm.getCollection('executions');

        log.info("Successfully loaded ExecutionContextService");
    }

    async getExecutionContexts(query, options) {
        return await this.ExecutionContexts.find(query, options).toArray();
    }

    async getExecutionContext(id) {
        const _id = ObjectId(id);
        return await this.ExecutionContexts.findOne({ _id });
    }

    async delExecutionContext(id) {
        const _id = ObjectId(id);
        const response = await this.ExecutionContexts.deleteOne({ _id });

        return formatDelete(response, _id);
    }

    /**
     * Update model
     * 
     * @param {*} id 
     * @param {*} value 
     */
    async putExecutionContext(id, value) {
        const _id = ObjectId(id);
        value.projectId = ObjectId(value.projectId)

        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        // updatedAt timestamp
        value.updatedAt = new Date();

        let response = await this.ExecutionContexts.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    /**
     * Post ExecutionContext model
     * 
     * @param {ExecutionContext} value
     */
    async postExecutionContext(value) {
        value.userId = ObjectId(value.userId);
        value.projectId = ObjectId(value.projectId);
        value.reference = value.reference && ObjectId(value.reference);

        value.createdAt = new Date();

        let response = await this.ExecutionContexts.insertOne(value);

        return formatInsert(response)
    }

}

module.exports = new ExecutionContextService();
const dbm = require('../helpers/db');
const log = require('../helpers/log');
const { formatUpdate, formatDelete } = require('../helpers/utils');

class ExecutionContextService {

    async load() {
        this.ExecutionContexts = await dbm.getCollection('execution-contexts');
        log.info("Successfully loaded ExecutionContextService");
    }

    async getExecutionContexts(query, options) {
        return await this.ExecutionContexts.find(query, options).toArray();
    }

    async getExecutionContext(_id) {
        return await this.ExecutionContexts.findOne({ _id });
    }

    async delExecutionContext(_id) {
        const response = await this.ExecutionContexts.deleteOne({ _id });
        return formatDelete(response, _id);
    }

    async putExecutionContext(_id, value) {
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        let response = await this.ExecutionContexts.updateOne({ _id }, { $set: value });
        return formatUpdate(response, _id);
    }

    async postExecutionContext(value) {
        return await this.ExecutionContexts.insertOne(value);
    }

}

module.exports = new ExecutionContextService();
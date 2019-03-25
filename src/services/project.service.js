const dbm = require('../helpers/db');
const log = require('../helpers/log');
const { formatUpdate, formatDelete } = require('../helpers/utils');

class ProjectService {

    async load() {
        this.Projects = await dbm.getCollection('projects');
        log.info("Successfully loaded ProjectService");
    }

    async getProjects(query, options) {
        return await this.Projects.find(query, options).toArray();
    }

    async getProject(_id) {
        return await this.Projects.findOne({ _id });
    }

    async postProject(value) {
        const result = await this.Projects.insertOne(value);
        return result.ops[0];
    }

    async postProjects(value) {
        const result = await this.Projects.insertMany(value);
        return result.ops;
    }

    async putProject(_id, value) {
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        const result = await this.Projects.updateOne({ _id }, { $set: value });
        return formatUpdate(result, _id);
    }

    async delProject(_id) {
        const result = await this.Projects.deleteOne({ _id });
        return formatDelete(result, _id);
    }
}

module.exports = new ProjectService();
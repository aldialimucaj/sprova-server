const ObjectId = require('mongodb').ObjectId;
const dbm = require('../helpers/db');
const log = require('../helpers/log');
const { formatInsert, formatUpdate, formatDelete } = require('../helpers/utils');

class ProjectService {

    async load() {
        this.Projects = await dbm.getCollection('projects');
        this.TestCases = await dbm.getCollection('testcases');
        this.Cycles = await dbm.getCollection('cycles');
        log.info("Successfully loaded ProjectService");
    }

    async getProjects(query, options) {
        return await this.Projects.find(query, options).toArray();
    }

    async getProject(id) {
        const _id = ObjectId(id);
        return await this.Projects.findOne({ _id });
    }

     /**
     * Find cycles belonging to this project
     * 
     * @param {*} id Project ID
     */
    async getCyclesByProjectId(id) {
        const _id = ObjectId(id);
        return await this.Cycles.find({ projectId: _id }).toArray();
    }

    /**
     * Find test cases belonging to this project
     * 
     * @param {*} id Project ID
     */
    async getTestCasesByProjectId(id) {
        const _id = ObjectId(id);
        const response = await this.TestCases.find({ projectId: _id }).toArray();
        for (let t of response) {
            t.isParent = await this.TestCases.countDocuments({ parentId: t._id }) > 0;
        }

        return response;
    }

    async delProject(id) {
        const _id = ObjectId(id);
        const result = await this.Projects.deleteOne({ _id });

        return formatDelete(result, _id);
    }

    /**
     * Update model
     * 
     * @param {*} id 
     * @param {*} value 
     */
    async putProject(id, value) {
        const _id = ObjectId(id);

        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        value.updatedAt = new Date();

        const response = await this.Projects.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    /**
     * Create model
     * 
     * @param {*} value
     */
    async postProject(value) {
        // TODO: make possible to define own _id as it allows us to fetch through the URL
        delete value._id;

        value.createdAt = new Date();
        value.updatedAt = new Date();

        const response = await this.Projects.insertOne(value);

        return formatInsert(response);
    }
}

module.exports = new ProjectService();
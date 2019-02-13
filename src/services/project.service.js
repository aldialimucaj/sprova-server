const ObjectId = require('mongodb').ObjectId;
const { formatInsert, formatUpdate, formatRemove } = require('../helpers/utils');

var Projects = undefined;
var TestCases = undefined;
var Cycles = undefined;

class ProjectService {

    constructor(db) {
        Projects = db.collection('projects');
        TestCases = db.collection('testcases');
        Cycles = db.collection('cycles');
    }

    // ============================================================================

    async getProjects(query, options) {
        return await Projects.find(query, options).toArray();
    }

    async getProject(id) {
        const _id = ObjectId(id);
        return await Projects.findOne({ _id });
    }

     /**
     * Find cycles belonging to this project
     * 
     * @param {*} id Project ID
     */
    async getCyclesByProjectId(id) {
        const _id = ObjectId(id);
        return await Cycles.find({ projectId: _id }).toArray();
    }

    /**
     * Find test cases belonging to this project
     * 
     * @param {*} id Project ID
     */
    async getTestCasesByProjectId(id) {
        const _id = ObjectId(id);
        const response = await TestCases.find({ projectId: _id }).toArray();
        for (let t of response) {
            t.isParent = await TestCases.countDocuments({ parentId: t._id }) > 0;
        }

        return response;
    }

    // ============================================================================

    async delProject(id) {
        const _id = ObjectId(id);
        const result = await Projects.remove({ _id });

        return formatRemove(result, _id);
    }

    // ============================================================================

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

        const response = await Projects.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    // ============================================================================

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

        const response = await Projects.insertOne(value);

        return formatInsert(response);
    }
}

module.exports = ProjectService;
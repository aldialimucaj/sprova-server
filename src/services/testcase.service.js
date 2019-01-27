const ObjectId = require('mongodb').ObjectId;
const utils = require('../helpers/utils');
const { formatInsert, formatUpdate, formatRemove } = require('../helpers/utils');
const { ArtifactType } = require('../helpers/enums');

var TestCases = undefined;
var Artifacts = undefined;

class TestCaseService {

    constructor(db) {
        TestCases = db.collection('testcases');
        Artifacts = db.collection('artifacts');
    }

    // ============================================================================

    /**
     * Fetch test cases belonging to project
     * 
     * @param {*} projectId project ID. optional if not set all test cases from all projects are returned
     * @param {*} options options for the find request
     * @param {boolean} withParentFlag if also parents should be returned
     */
    async getTestCases(query, options, withParentFlag) {
        let result;

        result = await TestCases.find(query, options).toArray();
        if (withParentFlag) {
            for (let t of result) {
                t.isParent = await TestCases.countDocuments({ parentId: t._id }) > 0;
            }
        }

        return result;
    }

    /**
     * 
     * @param {*} id 
     * @param {boolean} withParentFlag if also parents should be returned
     */
    async getTestCase(id, withParentFlag) {
        const _id = ObjectId(id);
        let result;
        if (withParentFlag) {
            result = this.getTestCasewithParentFlag(id);
        } else {
            result = await TestCases.findOne({ _id })
        }

        return result;
    }

    /**
     * Return test case and its parents in for of { title: "child test case", parent: { title: "parent test case" } }
     * 
     * @param {*} id test case id
     */
    async getTestCasewithParentFlag(id) {
        var result;
        const _id = ObjectId(id);

        result = await TestCases.findOne({ _id });
        if (result.parentId && result.parentId.toString) {
            let parent = await this.getTestCasewithParentFlag({ params: { id: result.parentId.toString() } });
            result.parent = parent;
        }

        return result;
    }


    // ============================================================================

    /**
     * Update model
     * 
     * @param {*} id test case ID
     * @param {*} value 
     */
    async putTestCase(id, value) {
        const _id = ObjectId(id);

        // projectId comes in as string
        value.projectId = ObjectId(value.projectId)
        // parentId comes in as string
        if (value.parentId) {
            value.parentId = ObjectId(value.parentId)
        }
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        value.updatedAt = new Date();

        const response = await TestCases.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    // ============================================================================

    /**
     * Create new model
     * 
     * @param {*} value
     */
    async postTestCase(value) {
        // TODO: make possible to define own _id as it allows us to fetch through the URL
        delete value._id;
        // projectId comes in as string

        value.createdAt = new Date();
        value.updatedAt = new Date();

        value.projectId = ObjectId(value.projectId)
        if (value.parentId) {
            value.parentId = ObjectId(value.parentId)
        } else {
            delete value.parentId;
        }
        let response = await TestCases.insertOne(value);

        return formatInsert(response);
    }


    /**
     * Search in test cases
     * 
     * @param {*} value query and options value { query, options }
     */
    async findTestCases(value) {
        const { query, options } = value;

        if (query) {
            if (query.projectId) {
                query.projectId = ObjectId(query.projectId);
            }
            if (query.parentId) {
                query.parentId = ObjectId(query.parentId);
            }
        }

        // TODO sanitize options

        const response = await TestCases.find(query, options).toArray();
        for (let t of response) {
            if (t.executable) {
                t.isParent = await TestCases.countDocuments({ parentId: t._id }) > 0;
            } else {
                t.isParent = true;
            }
        }

        return response;
    }

    // ============================================================================

    async delTestCase(id) {
        const _id = ObjectId(id);

        const response = await TestCases.remove({ _id });

        return formatRemove(response, _id);
    }


}

module.exports = TestCaseService;
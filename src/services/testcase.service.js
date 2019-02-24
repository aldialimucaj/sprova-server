const ObjectId = require('mongodb').ObjectId;
const { formatInsert, formatInsertMany, formatUpdate, formatDelete, formatDeleteMany } = require('../helpers/utils');

var TestCases = undefined;

class TestCaseService {

    constructor(db) {
        TestCases = db.collection('testcases');
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
        const result = await TestCases.find(query, options).toArray();
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
        const _id = ObjectId(id);

        const result = await TestCases.findOne({ _id });
        if (result.parentId && result.parentId.toString) {
            let parent = await this.getTestCasewithParentFlag(result.parentId.toString());
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
        let response;
        let result;
        if (Array.isArray(value)) {
            result = [];
            const ids = value.map(v => v._id);
            const values = value.map(v => this.prepareForUpdate(v));
            for (let v of values) {
                response = await TestCases.updateMany({ _id: { $in: ids } }, { $set: v });
                const updateResponse = formatUpdate(response, ids);
                result.push(updateResponse);
            }
        } else {
            const _id = ObjectId(id);
            response = await TestCases.updateOne({ _id }, { $set: value });
            result = formatUpdate(response, _id);
        }

        return result;
    }

    // ============================================================================

    /**
     * Create new model
     * 
     * @param {*} value
     */
    async postTestCase(value) {
        let response;
        let result;
        if (Array.isArray(value)) {
            response = await TestCases.insertMany(value.map(t => this.prepareForInsert(t)));
            result = formatInsertMany(response);
        } else {
            response = await TestCases.insertOne(this.prepareForInsert(value));
            result = formatInsert(response);
        }

        return result;
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

    async delTestCase(value) {
        let response;
        let result;

        if (Array.isArray(value)) {
            response = await TestCases.deleteMany({ _id: { $in: value.map(v => ObjectId(v)) } });
            result = formatDeleteMany(response, value);
        } else {
            const _id = ObjectId(value);
            const response = await TestCases.deleteOne({ _id });
            result = formatDelete(response, _id);
        }

        return result;
    }

    prepareForInsert(value) {
        // TODO: make possible to define own _id as it allows us to fetch through the URL
        delete value._id;
        // projectId comes in as string

        value.createdAt = new Date();
        value.updatedAt = new Date();

        return value;
    }

    prepareForUpdate(value) {
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        value.updatedAt = new Date();

        return value;
    }


}

module.exports = TestCaseService;
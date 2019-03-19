const ObjectId = require('mongodb').ObjectId;
const dbm = require('../helpers/db');
const { formatInsert, formatInsertMany, formatUpdate, formatDelete, formatDeleteMany } = require('../helpers/utils');

class TestCaseService {

    constructor() {
        this.TestCases = dbm.getCollection('testcases');
    }

    /**
     * Fetch test cases belonging to project
     * 
     * @param {*} projectId project ID. optional if not set all test cases from all projects are returned
     * @param {*} options options for the find request
     * @param {boolean} withParentFlag if also parents should be returned
     */
    async getTestCases(query, options, withParentFlag) {
        const result = await this.TestCases.find(query, options).toArray();
        if (withParentFlag) {
            for (let t of result) {
                t.isParent = await this.TestCases.countDocuments({ parentId: t._id }) > 0;
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
            result = await this.TestCases.findOne({ _id })
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

        const result = await this.TestCases.findOne({ _id });
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
                response = await this.TestCases.updateMany({ _id: { $in: ids } }, { $set: v });
                const updateResponse = formatUpdate(response, ids);
                result.push(updateResponse);
            }
        } else {
            const _id = ObjectId(id);
            response = await this.TestCases.updateOne({ _id }, { $set: value });
            result = formatUpdate(response, _id);
        }

        return result;
    }

    /**
     * Create new model
     * 
     * @param {*} value
     */
    async postTestCase(value) {
        let response;
        let result;

        if (Array.isArray(value)) {
            const testCases = value.map(t => this.prepareForInsert(t));
            response = await this.TestCases.insertMany(testCases);
            result = formatInsertMany(response);
            for (let testCase of testCases) {
                await this.copyChildren(testCase);
            }
        } else {
            response = await this.TestCases.insertOne(this.prepareForInsert(value));
            result = formatInsert(response);
            await this.copyChildren(value);
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

        const response = await this.TestCases.find(query, options).toArray();
        for (let t of response) {
            if (t.executable) {
                t.isParent = await this.TestCases.countDocuments({ parentId: t._id }) > 0;
            } else {
                t.isParent = true;
            }
        }

        return response;
    }

    async delTestCase(value) {
        let result = { ok: 0 };
        let children;
        // Test cases can reference each other, thus when deleting a parent
        // we should also take care of deleting its children as well.

        // TODO: make sure after deleting a test case to delete its references
        // in cycles and test sets
        if (Array.isArray(value) && value.length > 0) {
            const deleteIds = value.map(v => ObjectId(v));
            const response = await this.TestCases.deleteMany({ _id: { $in: deleteIds } });
            result = formatDeleteMany(response, value);
            children = await this.TestCases.find({ parentId: { $in: deleteIds } }).toArray();
        } else if (ObjectId.isValid(value)) {
            const _id = ObjectId(value);
            const response = await this.TestCases.deleteOne({ _id });
            result = formatDelete(response, _id);
            children = await this.TestCases.find({ parentId: _id }).toArray();
        }

        if (children && children.length) {
            await this.delTestCase(children.map(c => c._id));
        }

        return result;
    }

    /* ************************************************************************* */
    /*                                 HELPERS                                    */
    /* ************************************************************************* */

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

    async copyChildren(testCase) {
        if (testCase.cloneFromId) {
            const children = await this.TestCases.find({ parentId: testCase.cloneFromId }).toArray();
            for (let child of children) {
                child.parentId = testCase._id;
                await this.postTestCase(child, { cloneFromId: child._id });
            }
        }
    }
}

module.exports = new TestCaseService();
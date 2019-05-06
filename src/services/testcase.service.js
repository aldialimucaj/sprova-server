const dbm = require('../helpers/db');
const log = require('../helpers/log');
const { formatUpdate, formatDelete } = require('../helpers/utils');

class TestCaseService {

    async load() {
        this.TestCases = await dbm.getCollection('testcases');
        log.info("Successfully loaded TestCaseService");
    }

    async getTestCases(query, options) {
        return await this.TestCases.find(query, options).toArray()
    }

    async getTestCase(_id) {
        return await this.TestCases.findOne({ _id });
    }

    async getTestCaseSteps(_id, includeInherited) {
        const testCase = await this.TestCases.findOne({ _id });

        let inheritedSteps = [];
        if (includeInherited) {
            inheritedSteps = await this.resolveInheritance(testCase);
        }

        return [
            ...inheritedSteps, 
            ...testCase.steps
        ];
    }

    async postTestCase(value) {
        const result = await this.TestCases.insertOne(value);
        return result.ops[0];
    }

    async postTestCases(value) {
        const result = await this.TestCases.insertMany(value);
        return result.ops;
    }

    async putTestCase(_id, value) {
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        const result = await this.TestCases.updateOne({ _id }, { $set: value });
        return formatUpdate(result, _id);
    }

    async delTestCase(_id) {
        const result = await this.TestCases.deleteOne({ _id });
        return formatDelete(result, _id);
    }

    async resolveInheritance(testCase) {
        log.info('Resolve inheritance');
        let inheritedSteps = [];
        let parent = testCase.parentId && await this.TestCases.findOne({ _id: testCase.parentId });
        
        while (parent) {
            const title = parent.title;
            const parentSteps = parent.steps.map(step => ({
                ...step,
                inheritedFrom: title
            }));
            inheritedSteps = [
                ...parentSteps, 
                ...inheritedSteps
            ];
            parent = parent.parentId && await this.TestCases.findOne({ _id: parent.parentId });
        }
        return inheritedSteps;
    }

}

module.exports = new TestCaseService();
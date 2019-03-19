const ObjectId = require('mongodb').ObjectId;
const dbm = require('../helpers/db');
const {
    formatInsert,
    formatUpdate,
    formatDelete
} = require('../helpers/utils');
const log = require('../helpers/log');
const utils = require('../helpers/utils');

class UserService {

    async load() {
        this.Users = await dbm.getCollection('users');
        this.TestSets = await dbm.getCollection('testsets');
        this.TestCases = await dbm.getCollection('testcases');
        this.TestSetsExecution = await dbm.getCollection('testset-executions');
        log.info("Successfully loaded UserService");
    }

    async getUsers(query, options) {
        return await this.Users.find(query, options).toArray();
    }

    async getUser(id) {
        const _id = ObjectId(id);
        let result = await this.Users.findOne({ _id });

        return this.formatUser(result);
    }

    /**
     * Create model
     * 
     * @param {*} value 
     */
    async postUser(value) {
        var result;

        const username = value.username;

        value.password = utils.sha512(value.password);
        value.createdAt = new Date();

        try {
            let existingUser = await this.Users.findOne({ username });
            if (!existingUser) {
                let response = await this.Users.insertOne(value);
                result = formatInsert(response);
            } else {
                result = {
                    ok: 0,
                    error: 'Username already exists'
                };
            }
        } catch (e) {
            result = e;
        }

        return result;
    }

    async putUser(id, value) {
        const _id = ObjectId(id);

        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        value.updatedAt = new Date();

        const response = await this.Users.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    async delUser(id) {
        const _id = ObjectId(id);
        const response = await this.Users.deleteOne({ _id });

        return formatDelete(response, _id);
    }

    /* ************************************************************************* */
    /*                                 PRIVATE                                   */
    /* ************************************************************************* */

    /**
     * Format user so that it ca be delievered by API
     * 
     * @param {User} user user object
     */
    formatUser(user) {
        let result = Object.assign({}, user);
        // TODO clean all relevat properties
        delete result.password;

        return result;
    }
}

module.exports = new UserService();
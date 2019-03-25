const dbm = require('../helpers/db');
const { formatUpdate, formatDelete } = require('../helpers/utils');
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
        const result = await this.Users.find(query, options).toArray();
        return result.map(user => this.formatUser(user));
    }

    async getUser(_id) {
        let result = await this.Users.findOne({ _id });
        return this.formatUser(result);
    }

    async postUser(value) {
        const username = value.username;
        value.password = utils.sha512(value.password);

        try {
            let existingUser = await this.Users.findOne({ username });
            if (existingUser) {
                return {
                    ok: 0,
                    error: 'Username already exists'
                };
            }
            let response = await this.Users.insertOne(value);
            return response.ops[0];
        } catch (e) {
            return e;
        }
    }

    async putUser(_id, value) {
        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        const result = await this.Users.updateOne({ _id }, { $set: value });
        return formatUpdate(result, _id);
    }

    async delUser(_id) {
        const result = await this.Users.deleteOne({ _id });
        return formatDelete(result, _id);
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
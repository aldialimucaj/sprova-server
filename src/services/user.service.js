const ObjectId = require('mongodb').ObjectId;
const {
    formatInsert,
    formatUpdate,
    formatRemove
} = require('../helpers/utils');
const log = require('../helpers/log');
const utils = require('../helpers/utils');
var Users = undefined;

class UserService {
    constructor(db) {
        Users = db.collection('users');
        log.info("successfully loaded UserService");
    }

    // ============================================================================

    async getUsers(query, options) {
        return await Users.find(query, options).toArray();
    }

    async getUser(id) {
        const _id = ObjectId(id);
        let result = await Users.findOne({ _id });

        return this.formatUser(result);
    }

    // ============================================================================
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
            let existingUser = await Users.findOne({ username });
            if (!existingUser) {
                let response = await Users.insertOne(value);
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

    // ============================================================================

    async putUser(id, value) {
        const _id = ObjectId(id);

        // make sure not to change the id when editing
        delete value._id;
        // make sure createdAt was not changed
        delete value.createdAt;

        value.updatedAt = new Date();

        const response = await Users.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }

    // ============================================================================

    async delUser(id) {
        const _id = ObjectId(id);
        const response = await Users.remove({ _id });

        return formatRemove(response, _id);
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

module.exports = UserService;
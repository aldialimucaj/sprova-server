var jwt = require('jsonwebtoken');
var utils = require('./utils');
const log = require('./log');
var Users = undefined;
var JWT_SECRET = undefined;
class Authenticator {
    constructor(db) {
        this.db = db;
        JWT_SECRET = process.env.JWT_SECRET || 'you-hacker!';
    }

    async init() {
        try {
            Users = await this.db.collection('users');
            log.info('successfully initialized Authenticator');
            return true;
        } catch (error) {
            log.error(error);
            return false;
        }
    }

    async validate(username, password) {
        try {
            let user = await Users.findOne({ username });
            if (!user) {
                return { error: "user not found" };
            } else if (user.password !== utils.sha512(password)) {
                return { error: "wrong password" };
            } else {
                return user;
            }
        } catch (e) {
            log.error(e.stack);
            return { error: "user does not exist" };
        }
    }



    async authenticate(ctx) {
        let credentials = ctx.request.body;
        let user = await this.validate(credentials.username, credentials.password);
        if (user && !user.error) {
            ctx.status = 200;
            ctx.body = {
                token: jwt.sign(
                    {
                        _id: user._id,
                        username: user.username,
                        admin: user.admin,
                        firstname: user.firstname,
                        lastname: user.lastname
                    }, JWT_SECRET, { expiresIn: '3000d' }),
                message: "Successfully logged in!"
            };
        } else {
            ctx.status = 401;
            ctx.body = {
                error: user.error
            };
        }
    }
}

module.exports = Authenticator;
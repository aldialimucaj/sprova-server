var jwt = require('jsonwebtoken');
var utils = require('./utils');
const dbm = require('../helpers/db');
const log = require('./log');
const JWT_SECRET = process.env.JWT_SECRET || 'you-hacker!';
class Authenticator {

    async load() {
        this.Users = await dbm.getCollection('users');
        log.info("Successfully loaded Authenticator");
    }

    async validate(username, password) {
        try {
            let user = await this.Users.findOne({ username });
            if (!user) {
                return { error: "user not found" };
            } else if (user.password !== utils.sha512(password, JWT_SECRET)) {
                return { error: "wrong password" };
            } else {
                delete user.password;
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

module.exports = new Authenticator();
const log = require('../helpers/log');
const UserService = require('../services/user.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

class UserRestApi {
    constructor(router, db) {
        this.router = router;
        this.userService = new UserService(db);
        log.info("successfully loaded UserRestApi")
    }

    // ============================================================================

    async getUsers(ctx) {
        const query = formatQueryFromParams(ctx.query);
        const options = formatOptionsFromParams(ctx.query);

        ctx.body = await this.userService.getUsers(query, options);
    }

    async getUser(ctx) {
        ctx.body = await this.userService.getUser(ctx.params.id);
    }

    // ============================================================================

    async postUser(ctx) {
        const value = ctx.request.body;
        ctx.body = await this.userService.postUser(value);
    }

    // ============================================================================

    async putUser(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        ctx.body = await this.userService.putUser(id, value);
    }

    // ============================================================================

    async delUser(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.userService.delUser(id);
    }


    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.get('/users', this.getUsers.bind(this));
        this.router.get('/users/:id', this.getUser.bind(this));

        this.router.del('/users/:id', this.delUser.bind(this));

        this.router.put('/users/:id', this.putUser.bind(this));

        this.router.post('/users', this.postUser.bind(this));
    }
}

module.exports = UserRestApi;
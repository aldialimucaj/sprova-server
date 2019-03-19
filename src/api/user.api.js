const Router = require('koa-router');
const userService = require('../services/user.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const userRouter = new Router();

userRouter.get('/users', async (ctx) => {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await userService.getUsers(query, options);
});

userRouter.get('/users/:id', async (ctx) => {
    ctx.body = await userService.getUser(ctx.params.id);
});

userRouter.del('/users/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await userService.delUser(id);
});

userRouter.put('/users/:id', async (ctx) => {
    const id = ctx.params.id;
    const value = ctx.request.body;
    ctx.body = await userService.putUser(id, value);
});

userRouter.post('/users', async (ctx) => {
    const value = ctx.request.body;
    ctx.body = await userService.postUser(value);
});

module.exports = userRouter.routes();
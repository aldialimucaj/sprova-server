const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');
const userService = require('../services/user.service');
const { formatIDs, formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const userRouter = new Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);
userRouter.post('/users', postUser);
userRouter.put('/users/:id', putUser);
userRouter.del('/users/:id', deleteUser);

async function getUsers(ctx) {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await userService.getUsers(query, options);
}

async function getUser(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);

    ctx.body = await userService.getUser(_id);
}

async function deleteUser(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);

    ctx.body = await userService.delUser(_id);
}

async function putUser(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const value = ctx.request.body;
    
    ctx.body = await userService.putUser(_id, formatIDs(value));
}

async function postUser(ctx) {
    const value = ctx.request.body;
    value.createdAt = new Date();

    ctx.body = await userService.postUser(formatIDs(value));
}

module.exports = userRouter;
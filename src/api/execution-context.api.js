const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');
const executionContextService = require('../services/execution-context.service');
const { formatIDs, formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const executionContextRouter = new Router();

executionContextRouter.get('/execution-contexts', getExecutionContexts);
executionContextRouter.get('/execution-contexts/:id', getExecutionContext);
executionContextRouter.post('/execution-contexts', postExecutionContext);
executionContextRouter.put('/execution-contexts/:id', putExecutionContext);
executionContextRouter.put('/execution-contexts/:id/status', putExecutionContextStatus);
executionContextRouter.del('/execution-contexts/:id', deleteExecutionContext);

/**
 * @api {get} /execution-contexts Request execution contexts
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/execution-contexts?limit=10&skip=0
 * 
 * @apiParam {Number} limit limit result number
 * @apiParam {Number} skip skip first N results
 * @apiParam {Object} sort sort by field ie. { title: 1 }
 * 
 * @apiName getExecutionContexts
 * @apiGroup ExecutionContexts
 * 
 * @apiSuccess {Array} - list of execution contexts
 */
async function getExecutionContexts(ctx) {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);
    
    ctx.body = await executionContextService.getExecutionContexts(query, options);
}

/**
 * @api {get} /execution-contexts/:id Request execution context
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/execution-contexts/5af582d1dccd6600137334a0
 * 
 * @apiName getExecutionContext
 * @apiGroup ExecutionContexts
 * 
 * @apiParam {Number} id execution context's unique ID.
 * 
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 */
async function getExecutionContext(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);

    ctx.body = await executionContextService.getExecutionContext(_id);
}

/**
 * @api {post} /execution-contexts Post new execution context
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/execution-contexts 
 * 
 * @apiName postExecutionContext
 * @apiGroup ExecutionContexts
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
 * @apiSuccess {String} _id ID of newly added element
 */
async function postExecutionContext(ctx) {
    const value = ctx.request.body;
    value.createdAt = Date.now();

    if (value.status === "ACTIVE") {
        value.startedAt = Date.now();
    }

    ctx.body = await executionContextService.postExecutionContext(formatIDs(value));
    ctx.status = 201;
}

/**
 * @api {put} /execution-contexts/:id Edit execution context
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/execution-contexts/5af582d1dccd6600137334a0 
 * 
 * @apiName putExecutionContext
 * @apiGroup ExecutionContexts
 * 
 * @apiParam {Number} id execution context's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
async function putExecutionContext(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const value = ctx.request.body;

    ctx.body = await executionContextService.putExecutionContext(_id, formatIDs(value));
}

/**
 * @api {put} /execution-contexts/:id Edit execution context
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/execution-contexts/5af582d1dccd6600137334a0 
 * 
 * @apiName putExecutionContext
 * @apiGroup ExecutionContexts
 * 
 * @apiParam {Number} id execution context's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
async function putExecutionContextStatus(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const { status } = ctx.request.body;

    ctx.body = await executionContextService.putExecutionContextStatus(_id, status);
}

/**
 * @api {del} /execution-contexts/:id Delete execution
 * 
 * @apiExample {curl} Example usage:
 *     curl -X DEL http://localhost/api/execution-contexts/5af582d1dccd6600137334a0
 * 
 * @apiName delExecutionContext
 * @apiGroup ExecutionContexts
 * 
 * @apiParam {Number} id execution context's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 */
async function deleteExecutionContext(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);

    ctx.body = await executionContextService.delExecutionContext(_id);
}

module.exports = executionContextRouter;
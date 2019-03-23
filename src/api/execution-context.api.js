const Router = require('koa-router');
const executionContextService = require('../services/execution-context.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const executionContextRouter = new Router();

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
executionContextRouter.get('/', async (ctx) => {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);
    
    ctx.body = await executionContextService.getExecutionContexts(query, options);
});

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
executionContextRouter.get('/:id', async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await executionContextService.getExecutionContext(id);
});

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
executionContextRouter.post('/', async (ctx) => {
    const value = ctx.request.body;
    value.createdAt = new Date();
    ctx.body = await executionContextService.postExecutionContext(value);
    ctx.status = 201;
});

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
executionContextRouter.put('/:id', async (ctx) => {
    const { id } = ctx.params;
    const value = ctx.request.body;
    ctx.body = await executionContextService.putExecutionContext(id, value);
});

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
executionContextRouter.del('/:id', async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await executionContextService.delExecutionContext(id);
});

module.exports = executionContextRouter;
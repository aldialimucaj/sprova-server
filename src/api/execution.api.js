const Router = require('koa-router');
const executionService = require('../services/execution.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const executionRouter = new Router();

/**
 * @api {get} /executions Request executions
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/executions?limit=10&skip=0
 * 
 * @apiParam {Number} limit limit result number
 * @apiParam {Number} skip skip first N results
 * @apiParam {Object} sort sort by field ie. { title: 1 }
 * 
 * @apiName getExecutions
 * @apiGroup Executions
 * 
 * @apiSuccess {Array} - list of executions
 */
executionRouter.get('/', async (ctx) => {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);
    
    ctx.body = await executionService.getExecutions(query, options);
});

/**
 * @api {get} /executions/:id Request execution
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/executions/5af582d1dccd6600137334a0
 * 
 * @apiName getExecution
 * @apiGroup Executions
 * 
 * @apiParam {Number} id execution's unique ID.
 * 
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 */
executionRouter.get('/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await executionService.getExecution(id);
});

/**
 * @api {post} /executions Post new execution
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/executions 
 * 
 * @apiName postExecution
 * @apiGroup Executions
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
 * @apiSuccess {String} _id ID of newly added element
 */
executionRouter.post('/', async (ctx) => {
    const query = formatQueryFromParams(ctx.query);
    const value = ctx.request.body;
    const user = ctx.state.user;
    ctx.body = await executionService.postExecution(value, user, query.returnDocument);
    ctx.status = 201;
});

/**
 * @api {put} /executions/:id Edit execution
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0 
 * 
 * @apiName putExecution
 * @apiGroup Executions
 * 
 * @apiParam {Number} id execution's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
executionRouter.put('/:id', async (ctx) => {
    const id = ctx.params.id;
    const value = ctx.request.body;
    value.user = ctx.state.user;
    ctx.body = await executionService.putExecution(id, value);
});

/**
 * @api {put} /executions/:id/status Edit execution status
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"status":"SUCCESSFUL"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0 
 * 
 * @apiName putExecutionStatus
 * @apiGroup Executions
 * 
 * @apiParam {Number} id execution's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
executionRouter.put('/:id/status', async (ctx) => {
    const id = ctx.params.id;
    const value = ctx.request.body;
    value.user = ctx.state.user;
    ctx.body = await executionService.putExecutionStatus(id, value);
});

/**
 * @api {put} /executions/:id/steps/:stepIdx Edit execution step
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"status":"SUCCESSFUL"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0
 * 
 * @apiName putStepUpdate
 * @apiGroup Executions
 * 
 * @apiParam {Number} id execution's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
executionRouter.put('/:id/steps/:stepIdx', async (ctx) => {
    const id = ctx.params.id;
    const stepIdx = ctx.params.stepIdx;
    const value = ctx.request.body;

    ctx.body = await executionService.putStepUpdate(id, stepIdx, value);
});

/**
 * @api {put} /executions/:id/steps/:stepIdx/status Edit execution step status
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"status":"SUCCESSFUL"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0
 * 
 * @apiName putStepStatus
 * @apiGroup Executions
 * 
 * @apiParam {Number} id execution's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
executionRouter.put('/:id/steps/:stepIdx/status', async (ctx) => {
    const id = ctx.params.id;
    const stepIdx = ctx.params.stepIdx;
    const value = ctx.request.body;

    ctx.body = await executionService.putStepStatus(id, stepIdx, value);
});

/**
 * @api {put} /executions/:id/steps/:stepIdx/artifacts Edit execution step status
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"status":"SUCCESSFUL"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0/artifacts
 * 
 * @apiName putStepUpdateArtifact
 * @apiGroup Executions
 * 
 * @apiParam {Number} id execution's unique ID
 * @apiParam {Number} stepIdx execution step index
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
executionRouter.put('/:id/steps/:stepIdx/artifacts', async (ctx) => {
    const id = ctx.params.id;
    const stepIdx = ctx.params.stepIdx;
    const value = ctx.request.body;
    value.files = ctx.request.files;
    value.user = ctx.state.user;

    ctx.body = await executionService.putStepUpdateArtifact(id, stepIdx, value);
});

/**
 * @api {del} /executions/:id Delete execution
 * 
 * @apiExample {curl} Example usage:
 *     curl -X DEL http://localhost/api/executions/5af582d1dccd6600137334a0
 * 
 * @apiName delExecution
 * @apiGroup Executions
 * 
 * @apiParam {Number} id execution's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 */
executionRouter.del('/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await executionService.delExecution(id);
});

module.exports = executionRouter.routes();
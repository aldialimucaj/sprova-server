const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');
const executionService = require('../services/execution.service');
const { formatIDs, formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const executionRouter = new Router();

executionRouter.get('/executions', getExecutions);
executionRouter.get('/executions/:id', getExecution);
executionRouter.get('/executions/:id/steps', getExecutionSteps);
executionRouter.post('/executions', postExecutions);
executionRouter.put('/executions/:id', putExecution);
executionRouter.put('/executions/:id/status', putExecutionStatus);
executionRouter.put('/executions/:id/steps', putExecutionSteps);
executionRouter.put('/executions/:id/steps/:stepIdx', putExecutionStep);
executionRouter.put('/executions/:id/steps/:stepIdx/status', putExecutionStepStatus);
executionRouter.put('/executions/:id/steps/:stepIdx/artifacts', putExecutionStepArtifact);
executionRouter.del('/executions/:id', deleteExecution);

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
async function getExecutions(ctx) {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    if (query.withTitle) {
        delete query.withTitle;
        ctx.body = await executionService.getExecutionsWithTitle(query, options);
    } else {
        delete query.withTitle;
        ctx.body = await executionService.getExecutions(query, options);
    }
    
}

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
async function getExecution(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);

    ctx.body = await executionService.getExecution(_id);
}

/**
 * @api {get} /executions/:id/steps Request execution steps
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/executions/5af582d1dccd6600137334a0/steps
 * 
 * @apiName getExecutionSteps
 * @apiGroup Executions
 * 
 * @apiParam {Number} id execution's unique ID.
 * 
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 */
async function getExecutionSteps(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);

    ctx.body = await executionService.getExecutionSteps(_id);
}

/**
 * @api {post} /executions Post new execution(s)
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
async function postExecutions(ctx) {
    const value = ctx.request.body;
    if (Array.isArray(value)) {
        const executions = await Promise.all(value.map(async execution => {
            execution.createdAt = new Date();
            execution.steps = await executionService.resolveSteps(ObjectId(execution.testCaseId));
            return formatIDs(execution);
        }));
        ctx.body = await executionService.postExecutions(executions);    
    } else {
        value.createdAt = new Date();
        value.steps = await executionService.resolveSteps(ObjectId(value.testCaseId));
        ctx.body = await executionService.postExecution(formatIDs(value));
    }
    ctx.status = 201;
}

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
async function putExecution(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const value = ctx.request.body;

    ctx.body = await executionService.putExecution(_id, formatIDs(value));
}

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
async function putExecutionStatus(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const { status } = ctx.request.body;

    ctx.body = await executionService.putExecutionStatus(_id, status);
}

/**
 * @api {post} /executions Post new execution(s)
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
async function putExecutionSteps(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const value = ctx.request.body;
    
    if (Array.isArray(value)) {
        ctx.body = await executionService.putExecutionSteps(_id, value);    
    } else {
        ctx.body = await executionService.putExecutionStep(_id, value);
    }
}

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
async function putExecutionStep(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const stepIdx = ctx.params.stepIdx;
    const value = ctx.request.body;

    ctx.body = await executionService.putStepUpdate(_id, stepIdx, value);
}

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
async function putExecutionStepStatus(ctx) {
    const id = ctx.params.id;
    const stepIdx = ctx.params.stepIdx;
    const value = ctx.request.body;

    ctx.body = await executionService.putStepStatus(id, stepIdx, value);
}

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
async function putExecutionStepArtifact(ctx) {
    const id = ctx.params.id;
    const stepIdx = ctx.params.stepIdx;
    const value = ctx.request.body;
    value.files = ctx.request.files;
    value.user = ctx.state.user;

    ctx.body = await executionService.putStepUpdateArtifact(id, stepIdx, value);
}

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
async function deleteExecution(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    ctx.body = await executionService.delExecution(_id);
}

module.exports = executionRouter;
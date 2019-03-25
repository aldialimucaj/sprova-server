const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');
const cycleService = require('../services/cycle.service');
const { formatIDs, formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const cycleRouter = new Router();

cycleRouter.get('/cycles', getCycles);
cycleRouter.get('/cycles/:id', getCycle);
cycleRouter.get('/cycles/:id/testcases', getCycleTestCases);
cycleRouter.get('/cycles/:id/testcasesstats', getCyclesTestCaseStats);
cycleRouter.post('/cycles', postCycles);
cycleRouter.put('/cycles/:id', putCycle);
cycleRouter.del('/cycles/:id', deleteCycle);

/**
 * @api {get} /cycles Request cycles
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/cycles?limit=10&skip=0
 * 
 * @apiParam {Number} limit limit result number
 * @apiParam {Number} skip skip first N results
 * @apiParam {Object} sort sort by field ie. { title: 1 }
 * 
 * @apiName getCycles
 * @apiGroup Cycles
 * 
 * @apiSuccess {Array} - list of cycles
 */
async function getCycles(ctx) {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await cycleService.getCycles(query, options);
}

/**
 * @api {get} /cycles/:id Request cycle
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/cycles/5af582d1dccd6600137334a0
 * 
 * @apiName getCycle
 * @apiGroup Cycles
 * 
 * @apiParam {Number} id cycle's unique ID.
 * 
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 */
async function getCycle(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    ctx.body = await cycleService.getCycle(_id);
}

/**
 * @api {get} /cycles/:id/testcases Request test cases for this cycle
 * 
 * @apiName getCycleTestCases
 * @apiGroup Cycles
 * 
 * @apiSuccess {Array} - list of test cases
 */
async function getCycleTestCases(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await cycleService.getCycleTestCases(_id, query, options);
}

/**
 * @api {get} /cycles/:id/testcasestats Request test cases with statistics for this cycle
 * 
 * @apiName getTestCaseStats
 * @apiGroup Cycles
 * 
 * @apiSuccess {Array} - list of test cases
 */
async function getCyclesTestCaseStats(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await cycleService.getTestCasesStats(_id, query, options);
}

/**
 * @api {post} /cycles Post new cycle
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/cycles 
 * 
 * @apiName postCycle
 * @apiGroup Cycles
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
 * @apiSuccess {String} _id ID of newly added element
 */
async function postCycles(ctx) {
    const value = ctx.request.body;
    if (Array.isArray(value)) {
        const mapped = value.map(item => {
            item.createdAt = Date.now();
            return formatIDs(item);
        });
        ctx.body = await cycleService.postCycles(mapped);    
    } else {
        value.createdAt = Date.now();
        ctx.body = await cycleService.postCycle(formatIDs(value));
    }
    ctx.status = 201;
}

/**
 * @api {put} /cycles/:id Edit cycle
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/cycles/5af582d1dccd6600137334a0 
 * 
 * @apiName putCycle
 * @apiGroup Cycles
 * 
 * @apiParam {Number} id cycle's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
async function putCycle(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const value = ctx.request.body;
    ctx.body = await cycleService.putCycle(_id, value);
}

/**
 * @api {del} /cycles/:id Delete cycle
 * 
 * @apiExample {curl} Example usage:
 *     curl -X DEL http://localhost/api/cycles/5af582d1dccd6600137334a0
 * 
 * @apiName delCycle
 * @apiGroup Cycles
 * 
 * @apiParam {Number} id cycle's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 */
async function deleteCycle(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    ctx.body = await cycleService.delExecution(_id);
}

module.exports = cycleRouter;
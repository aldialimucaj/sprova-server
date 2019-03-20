const Router = require('koa-router');
const cycleService = require('../services/cycle.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const cycleRouter = new Router();

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
cycleRouter.get('/', async (ctx) => {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);
    ctx.body = await cycleService.getCycles(query, options);
});

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
cycleRouter.get('/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await cycleService.getCycle(id);
});

/**
 * @api {get} /cycles/:id/testcases Request test cases for this cycle
 * 
 * @apiName getCycleTestCases
 * @apiGroup Cycles
 * 
 * @apiSuccess {Array} - list of test cases
 */
cycleRouter.get('/:id/testcases', async (ctx) => {
    const id = ctx.params.id;
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await cycleService.getCycleTestCases(id, query, options);
});

/**
 * @api {get} /cycles/:id/testcasestats Request test cases with statistics for this cycle
 * 
 * @apiName getTestCaseStats
 * @apiGroup Cycles
 * 
 * @apiSuccess {Array} - list of test cases
 */
cycleRouter.get('/:id/testcasesstats', async (ctx) => {
    const id = ctx.params.id;
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await cycleService.getTestCasesStats(id, query, options);
});

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
cycleRouter.post('/', async (ctx) => {
    const value = ctx.request.body;
    value.user = ctx.state.user;
    ctx.body = await cycleService.postCycle(value);
});

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
cycleRouter.put('/:id', async (ctx) => {
    const id = ctx.params.id;
    const value = ctx.request.body;
    value.user = ctx.state.user;
    ctx.body = await cycleService.putCycle(id, value);
});

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
cycleRouter.del('/:id', async (ctx) => {
    const id = ctx.params.id;
    if (!id) {
        throw new Error("You cannot delete what you don't know to exist. Invalid ID.");
    }
    ctx.body = await cycleService.delCycle(id);
});

module.exports = cycleRouter;
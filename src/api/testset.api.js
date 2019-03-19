const Router = require('koa-router');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');
const testSetService = require('../services/testset.service');

const testsetRouter = new Router();

/**
 * @api {get} /testsets Request testSets
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/testsets?limit=10&skip=0
 * 
 * @apiParam {Number} limit limit result number
 * @apiParam {Number} skip skip first N results
 * @apiParam {Object} sort sort by field ie. { title: 1 }
 * 
 * @apiName getTestSets
 * @apiGroup TestSets
 * 
 * @apiSuccess {Array} - list of testSets
 */
testsetRouter.get('/', async (ctx) => {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await testSetService.getTestSets(query, options);
});

/**
 * @api {get} /testsets/:id Request testSet
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/testsets/5af582d1dccd6600137334a0
 * 
 * @apiName getTestSet
 * @apiGroup TestSets
 * 
 * @apiParam {Number} id testSet's unique ID.
 * 
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 */
testsetRouter.get('/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await testSetService.getTestSet(id);
});

/**
 * @api {get} /testsets/:id/testcases Request testCases for this testSet
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/testsets/5af582d1dccd6600137334a0/testcases
 * 
 * @apiName getTestSetTestCases
 * @apiGroup TestSets
 * 
 * @apiParam {Number} id testSet's unique ID.
 * 
 * @apiSuccess {Array} array
 */
testsetRouter.get('/:id/testcases', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await testSetService.getTestSetTestCases(id);
});

/**
 * @api {get} /testsets/:id/testset-executions Request testSetExecutions for this testSet
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/testsets/5af582d1dccd6600137334a0/executions
 * 
 * @apiName getTestSetTestSetExecutions
 * @apiGroup TestSets
 * 
 * @apiParam {Number} id testSet's unique ID.
 * 
 * @apiSuccess {Array} array
 */
testsetRouter.get('/:id/testset-executions', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await testSetService.getTestSetTestSetExecutions(id);
});

/**
 * @api {put} /testsets/:id Edit testSet
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/testsets/5af582d1dccd6600137334a0 
 * 
 * @apiName putTestSet
 * @apiGroup TestSets
 * 
 * @apiParam {Number} id testSet's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
testsetRouter.put('/:id', async (ctx) => {
    const id = ctx.params.id;
    const value = ctx.request.body;
    value.user = ctx.state.user;
    ctx.body = await testSetService.putTestSet(id, value);
});

/**
 * @api {post} /testsets Post new testSet
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/testsets 
 * 
 * @apiName postTestSet
 * @apiGroup TestSets
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
 * @apiSuccess {String} _id ID of newly added element
 */
testsetRouter.post('/', async (ctx) => {
    const value = ctx.request.body;
    value.user = ctx.state.user;
    ctx.body = await testSetService.postTestSet(value);
    ctx.status = 201;
});

/**
 * @api {del} /testsets/:id Delete testSet
 * 
 * @apiExample {curl} Example usage:
 *     curl -X DEL http://localhost/api/testsets/5af582d1dccd6600137334a0
 * 
 * @apiName delTestSet
 * @apiGroup TestSets
 * 
 * @apiParam {Number} id testSet's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 */
testsetRouter.del('/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await testSetService.delTestSet(id);
});

module.exports = testsetRouter.routes();
const Router = require('koa-router');
const { formatQueryFromParams, formatOptionsFromParams, formatIDs } = require('../helpers/utils');
const testCaseService = require('../services/testcase.service');
const ObjectId = require('mongodb').ObjectId

const testcaseRouter = new Router();

/**
 * @api {get} /testcases Request testcases
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/testcases?limit=10&skip=0
 * 
 * @apiParam {Number} limit limit result number
 * @apiParam {Number} skip skip first N results
 * @apiParam {Object} sort sort by field ie. { title: 1 }
 * 
 * @apiName getTestCases
 * @apiGroup TestCases
 * 
 * @apiSuccess {Array} - list of testcases
 */
testcaseRouter.get('/', async (ctx) => {
    const options = formatOptionsFromParams(ctx.query);
    const query = formatQueryFromParams(ctx.query);
    const withParentFlag = !!ctx.query.withParentFlag;

    ctx.body = await testCaseService.getTestCases(query, options, withParentFlag);
});

/**
 * @api {get} /testcases/:id Request testcase
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/testcases/5af582d1dccd6600137334a0
 * 
 * @apiName getTestCase
 * @apiGroup TestCases
 * 
 * @apiParam {Number} id testcase's unique ID.
 * @apiParam {String} withParentFlag if parents should be included
 * 
 * @apiSuccess {String} title
 * @apiSuccess {String} description
 */
testcaseRouter.get('/:id', async (ctx) => {
    const id = ctx.params.id;
    const withParentFlag = ctx.query.withParentFlag && ctx.query.withParentFlag.toLowerCase() === 'true';
    ctx.body = await testCaseService.getTestCase(id, withParentFlag);
});

/**
 * @api {put} /testcases/:id Edit testcase
 * 
 * @apiExample {curl} Example usage:
 *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/testcases/5af582d1dccd6600137334a0 
 * 
 * @apiName putTestCase
 * @apiGroup TestCases
 * 
 * @apiParam {Number} id testcase's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 * @apiSuccess {String} _id ID of edited element
 */
testcaseRouter.put('/:id', async (ctx) => {
    const id = ctx.params.id;
    let value = ctx.request.body;
    if (Array.isArray(value)) {
        value = value.map(v => {
            v.user = ctx.state.user;
            return formatIDs(v);
        })
    } else {
        value.user = ctx.state.user;
        value = formatIDs(value);
    }

    ctx.body = await testCaseService.putTestCase(id, value);
});

/**
 * @api {post} /testcases Post new testcase
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/testcases 
 * 
 * @apiName postTestCase
 * @apiGroup TestCases
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
 * @apiSuccess {String} _id ID of newly added element
 */
testcaseRouter.post('/', async (ctx) => {
    let value = ctx.request.body;
    const query = formatQueryFromParams(ctx.query);

    if (Array.isArray(value)) {
        value = value.map(v => {
            v.user = ctx.state.user;
            return formatIDs(v);
        })
    } else {
        value.user = ctx.state.user;
        value = formatIDs(value);
    }

    ctx.body = await testCaseService.postTestCase(value, query);
    ctx.status = 201;
});

/**
 * @api {del} /testcases/:id Delete testcase
 * 
 * @apiExample {curl} Example usage:
 *     curl -X DEL http://localhost/api/testcases/5af582d1dccd6600137334a0
 * 
 * @apiName delTestCase
 * @apiGroup TestCases
 * 
 * @apiParam {Number} id testcase's unique ID.
 * 
 * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
 */
testcaseRouter.del('/:id', async (ctx) => {
    let id = ctx.params.id;
    if (id.includes(',')) {
        id = id.split(',').map(v => ObjectId(v));
    } else {
        id = ObjectId(id);
    }

    ctx.body = await testCaseService.delTestCase(id);
});

module.exports = testcaseRouter;
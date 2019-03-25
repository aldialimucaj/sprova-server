const Router = require('koa-router');
const { formatQueryFromParams, formatOptionsFromParams, formatIDs } = require('../helpers/utils');
const testCaseService = require('../services/testcase.service');
const ObjectId = require('mongodb').ObjectId

const testCaseRouter = new Router();

testCaseRouter.get('/testcases', getTestCases);
testCaseRouter.get('/testcases/:id', getTestCase);
testCaseRouter.post('/testcases', postTestCases);
testCaseRouter.put('/testcases/:id', putTestCase);
testCaseRouter.del('/testcases/:id', deleteTestCase);

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
async function getTestCases(ctx) {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await testCaseService.getTestCases(query, options);
}

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
async function getTestCase(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    
    ctx.body = await testCaseService.getTestCase(_id);
}

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
async function postTestCases(ctx) {
    const value = ctx.request.body;
    if (Array.isArray(value)) {
        const mapped = value.map(item => {
            item.createdAt = new Date();
            return formatIDs(item);
        });
        ctx.body = await testCaseService.postTestCases(mapped);    
    } else {
        value.createdAt = new Date();
        ctx.body = await testCaseService.postTestCase(formatIDs(value));
    }
    ctx.status = 201;
}

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
async function putTestCase(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const value = ctx.request.body;

    ctx.body = await testCaseService.putTestCase(_id, formatIDs(value));
}

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
async function deleteTestCase(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);

    ctx.body = await testCaseService.delTestCase(_id);
}

module.exports = testCaseRouter;
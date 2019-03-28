const Router = require('koa-router');
const cycleService = require('../services/cycle.service');
const executionService = require('../services/execution.service');
const projectService = require('../services/project.service');
const testCaseService = require('../services/testcase.service');
const { formatIDs } = require('../helpers/utils');

const searchRouter = new Router();

/**
 * @api {post} /search/projects Search for projects
 * 
 * @apiName findProjects
 * @apiGroup Search
 * 
 * @apiSuccess {Array} - list of projects
 */
searchRouter.post('/projects', async (ctx) => {
    const value = ctx.request.body;
    const query = formatIDs(value.query);
    ctx.body = await projectService.getProjects(query);
});

/**
 * @api {post} /search/cycles Search for cycles
 * 
 * @apiName findCycles
 * @apiGroup Search
 * 
 * @apiSuccess {Array} - list of cycles
 */
searchRouter.post('/cycles', async (ctx) => {
    const value = ctx.request.body;
    const query = formatIDs(value.query)
    ctx.body = await cycleService.findCycles(query);
});

/**
 * @api {post} /search/cycles/:id/testcases Search for cycles
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/search/cycles/:id/testcases 
 *
 * @apiName findCycleTestCases
 * @apiGroup Search
 * 
 * @apiSuccess {Array} - list of test cases
 */
searchRouter.post('/cycles/:id/testcases/find', async (ctx) => {
    const id = ctx.params.id;
    const value = ctx.request.body;
    ctx.body = await cycleService.findCycleTestCases(id, value);
});

/**
 * @api {post} /search/cycles/:id/testcases/findOne Search for cycles
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/search/cycles/:id/testcases
 *
 * @apiName findOneCycleTestCase
 * @apiGroup Search
 * 
 * @apiSuccess {TestCase} - test case
 */
searchRouter.post('/cycles/:id/testcases/findOne', async (ctx) => {
    const id = ctx.params.id;
    const value = ctx.request.body;
    const query = formatIDs(value.query);
    ctx.body = await cycleService.findOneCycleTestCase(id, query);
});

/**
 * @api {post} /search/executions Search for executions
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/search/executions 
 * 
 * @apiName findExecutions
 * @apiGroup Search
 * 
 * @apiSuccess {Array} - list of executions
 */
searchRouter.post('/executions', async (ctx) => {
    const value = ctx.request.body;
    ctx.body = await executionService.findExecutions(value);
});

/**
 * @api {post} /search/testcases Search for testcases
 * 
 * @apiExample {curl} Example usage:
 *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/search/testcases 
 * 
 * @apiName findTestCases
 * @apiGroup Search
 * 
 * @apiSuccess {Array} - list of testcases
 */
searchRouter.post('/testcases', async (ctx) => {
    const value = ctx.request.body;
    ctx.body = await testCaseService.findTestCases(value);
});

module.exports = searchRouter;
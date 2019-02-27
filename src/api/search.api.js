const log = require('../helpers/log');
const CycleService = require('../services/cycle.service');
const ExecutionService = require('../services/execution.service');
const ProjectService = require('../services/project.service');
const TestCaseService = require('../services/testcase.service');
const TestSetExecutionService = require('../services/testset-execution.service');
const TestSetService = require('../services/testset.service');
const { formatIDs } = require('../helpers/utils');


class SearchRestApi {
    constructor(router, db) {
        this.router = router;
        this.cycleService = new CycleService(db);
        this.executionService = new ExecutionService(db);
        this.projectService = new ProjectService(db);
        this.testCaseService = new TestCaseService(db);
        this.testSetExecutionService = new TestSetExecutionService(db);
        this.testSetService = new TestSetService(db);

        log.info("successfully loaded SearchRestApi")
    }

    // ============================================================================


    /**
     * @api {post} /search/projects Search for projects
     * 
     * @apiName findProjects
     * @apiGroup Search
     * 
     * @apiSuccess {Array} - list of projects
     */
    async findProjects(ctx) {
        const value = ctx.request.body;
        const query = formatIDs(value.filter);
        ctx.body = await this.projectService.getProjects(query);
    }

    /**
     * @api {post} /search/cycles Search for cycles
     * 
     * @apiName findCycles
     * @apiGroup Search
     * 
     * @apiSuccess {Array} - list of cycles
     */
    async findCycles(ctx) {
        const value = ctx.request.body;
        ctx.body = await this.cycleService.findCycles(value);
    }

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
    async findCycleTestCases(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        ctx.body = await this.cycleService.findCycleTestCases(id, value);
    }

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
    async findOneCycleTestCase(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        ctx.body = await this.cycleService.findOneCycleTestCase(id, value);
    }

    /**
     * @api {post} /search/cycles/:id/testsets Search for test sets in cycle
     * 
     * @apiExample {curl} Example usage:
     *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/search/cycles/:id/testsets 
     *
     * @apiName findCycleTestSets
     * @apiGroup Search
     * 
     * @apiSuccess {Array} - list of test sets
     */
    async findCycleTestSets(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        ctx.body = await this.cycleService.findCycleTestSets(id, value);
    }

    /**
     * @api {post} /search/cycles/:id/testsets/findOne Search for test set in cycle
     * 
     * @apiExample {curl} Example usage:
     *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/search/cycles/:id/testsets/findOne 
     * 
     * @apiName findOneCycleTestSet
     * @apiGroup Search
     * 
     * @apiSuccess {TestSet} - testset
     */
    async findOneCycleTestSet(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        ctx.body = await this.cycleService.findOneCycleTestSet(id, value);
    }

    // ============================================================================


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
    async findExecutions(ctx) {
        const value = ctx.request.body;
        ctx.body = await this.executionService.findExecutions(value);
    }

    // ============================================================================

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
    async findTestCases(ctx) {
        const value = ctx.request.body;

        ctx.body = await this.testCaseService.findTestCases(value);
    }

    // ============================================================================

    /**
     * @api {post} /search/testset-executions Search for test set executions
     * 
     * @apiExample {curl} Example usage:
     *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/search/testset-executions 
     * 
     * @apiName findTestSetExecutions
     * @apiGroup Search
     * 
     * @apiSuccess {Array} - list of test set executions
     */
    async findTestSetExecutions(ctx) {
        const value = ctx.request.body;
        ctx.body = await this.testSetExecutionService.findTestSetExecutions(value);
    }

    // ============================================================================

    /**
     * @api {post} /search/testsets Search for test set resources
     * 
     * @apiExample {curl} Example usage:
     *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/search/testsets 
     * 
     * @apiName postTestSet
     * @apiGroup Search
     * 
     * @apiSuccess {Array} - list of test sets
     */
    async findTestSets(ctx) {
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.testSetService.findTestSets(value);
    }



    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.post('/search/projects', this.findProjects.bind(this));
        this.router.post('/search/cycles', this.findCycles.bind(this));
        this.router.post('/search/cycles/:id/testcases/find', this.findCycleTestCases.bind(this));
        this.router.post('/search/cycles/:id/testcases/findOne', this.findOneCycleTestCase.bind(this));
        this.router.post('/search/cycles/:id/testsets/find', this.findCycleTestSets.bind(this));
        this.router.post('/search/cycles/:id/testsets/findOne', this.findOneCycleTestSet.bind(this));

        this.router.post('/search/executions', this.findExecutions.bind(this));

        this.router.post('/search/testcases', this.findTestCases.bind(this));

        this.router.post('/search/testset-executions', this.findTestSetExecutions.bind(this));

        this.router.post('/search/testsets', this.findTestSets.bind(this));
    }
}

module.exports = SearchRestApi;
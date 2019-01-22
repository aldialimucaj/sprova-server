const log = require('../helpers/log');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');
const TestSetExecutionService = require('../services/testset-execution.service');

class TestSetExecutionRestApi {

    constructor(router, db) {
        this.router = router;

        this.testSetExecutionService = new TestSetExecutionService(db);
        log.info("successfully loaded TestSetExecutionRestApi")
    }

    // ============================================================================

    /**
     * @api {get} /testset-executions Request testSetExecutions
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/testset-executions?limit=10&skip=0
     * 
     * @apiParam {Number} limit limit result number
     * @apiParam {Number} skip skip first N results
     * @apiParam {Object} sort sort by field ie. { title: 1 }
     * 
     * @apiName getTestSetExecutions
     * @apiGroup TestSetExecutions
     * 
     * @apiSuccess {Array} - list of testSetExecutions
     */
    async getTestSetExecutions(ctx) {
        const query = formatQueryFromParams(ctx.query);
        const options = formatOptionsFromParams(ctx.query);

        ctx.body = await this.testSetExecutionService.getTestSetExecutions(query, options);
    }

    /**
     * @api {get} /testset-executions/:id Request testSetExecution
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/testset-executions/5af582d1dccd6600137334a0
     * 
     * @apiName getTestSetExecution
     * @apiGroup TestSetExecutions
     * 
     * @apiParam {Number} id testSetExecution's unique ID.
     * 
     * @apiSuccess {String} title
     * @apiSuccess {String} description
     */
    async getTestSetExecution(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testSetExecutionService.getTestSetExecution(id);
    }


    /**
     * @api {get} /testset-executions/:id/next-pending Request testSetExecution next pending test
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/testset-executions/5af582d1dccd6600137334a0/next-pending
     * 
     * @apiName getNextPendingTest
     * @apiGroup TestSetExecutions
     * 
     * @apiParam {Number} id testSetExecution's unique ID.
     * 
     * @apiSuccess {String} title
     * @apiSuccess {String} description
     */
    async getNextPendingTest(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testSetExecutionService.getNextPendingTest(id);
    }

    /**
     * @api {get} /testset-executions/:id/has-pending Request testSetExecution if it has a pending test
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/testset-executions/5af582d1dccd6600137334a0/has-pending
     * 
     * @apiName hasPendingTest
     * @apiGroup TestSetExecutions
     * 
     * @apiParam {Number} id testSetExecution's unique ID.
     * 
     * @apiSuccess {String} title
     * @apiSuccess {String} description
     */
    async hasPendingTest(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testSetExecutionService.hasPendingTest(id);
    }

    // ============================================================================

    /**
     * @api {post} /testset-executions Post new testSetExecution
     * 
     * @apiExample {curl} Example usage:
     *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/testset-executions 
     * 
     * @apiName postTestSetExecution
     * @apiGroup TestSetExecutions
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
     * @apiSuccess {String} _id ID of newly added element
     */
    async postTestSetExecution(ctx) {
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.testSetExecutionService.postTestSetExecution(value);
        ctx.status = 201;
    }


    // ============================================================================

    /**
     * @api {put} /testset-executions/:id Edit testSetExecution
     * 
     * @apiExample {curl} Example usage:
     *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/testset-executions/5af582d1dccd6600137334a0 
     * 
     * @apiName putTestSetExecution
     * @apiGroup TestSetExecutions
     * 
     * @apiParam {Number} id testSetExecution's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     * @apiSuccess {String} _id ID of edited element
     */
    async putTestSetExecution(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.testSetExecutionService.putTestSetExecution(id, value);
    }


    // ============================================================================

    /**
     * @api {del} /testset-executions/:id Delete testSetExecution
     * 
     * @apiExample {curl} Example usage:
     *     curl -X DEL http://localhost/api/testset-executions/5af582d1dccd6600137334a0
     * 
     * @apiName delTestSetExecution
     * @apiGroup TestSetExecutions
     * 
     * @apiParam {Number} id testSetExecution's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     */
    async delTestSetExecution(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testSetExecutionService.delTestSetExecution(id);
    }

    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.get('/testset-executions', this.getTestSetExecutions.bind(this));
        this.router.get('/testset-executions/:id', this.getTestSetExecution.bind(this));
        this.router.get('/testset-executions/:id/next-pending', this.getNextPendingTest.bind(this));
        this.router.get('/testset-executions/:id/has-pending', this.hasPendingTest.bind(this));

        this.router.put('/testset-executions/:id', this.putTestSetExecution.bind(this));
        
        this.router.post('/testset-executions', this.postTestSetExecution.bind(this));

        this.router.del('/testset-executions/:id', this.delTestSetExecution.bind(this));
    }
}

module.exports = TestSetExecutionRestApi;
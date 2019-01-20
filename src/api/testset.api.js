const log = require('../helpers/log');
const TestSetService = require('../services/testset.service');

class TestSetRestApi {

    constructor(router, db) {
        this.router = router;
        this.testSetService = new TestSetService(db);
        log.info("successfully loaded TestSetRestApi")
    }

    // ============================================================================

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
    async getTestSets(ctx) {
        const {
            limit,
            skip,
            sort
        } = ctx.params;
        ctx.body = await this.testSetService.getTestSets({}, {
            limit,
            skip,
            sort
        });
    }

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
    async getTestSet(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testSetService.getTestSet(id);
    }

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
    async getTestSetTestCases(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testSetService.getTestSetTestCases(id);
    }

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
    async getTestSetTestSetExecutions(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testSetService.getTestSetTestSetExecutions(id);
    }

    // ============================================================================

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
    async postTestSet(ctx) {
        const value = ctx.request.body;
        value.user = ctx.params.user;
        ctx.body = await this.testSetService.postTestSet(value);
        ctx.status = 201;
    }

    // ============================================================================

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
    async putTestSet(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        value.user = ctx.params.user;
        ctx.body = await this.testSetService.putTestSet(id, value);
    }


    // ============================================================================

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
    async delTestSet(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testSetService.delTestSet(id);
    }


    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.get('/testsets', this.getTestSets.bind(this));
        this.router.get('/testsets/:id', this.getTestSet.bind(this));
        this.router.get('/testsets/:id/testcases', this.getTestSetTestCases.bind(this));
        this.router.get('/testsets/:id/testset-executions', this.getTestSetTestSetExecutions.bind(this));

        this.router.put('/testsets/:id', this.putTestSet.bind(this));

        this.router.post('/testsets', this.postTestSet.bind(this));

        this.router.del('/testsets/:id', this.delTestSet.bind(this));
    }
}

module.exports = TestSetRestApi;
const log = require('../helpers/log');
const CycleService = require('../services/cycle.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

class CycleRestApi {

    constructor(router, db) {
        this.router = router;
        this.cycleService = new CycleService(db);
        log.info("successfully loaded CycleRestApi")
    }

    // ============================================================================

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
    async getCycles(ctx) {
        const options = formatOptionsFromParams(ctx.query);
        const query = formatQueryFromParams(ctx.query);
        ctx.body = await this.cycleService.getCycles(query, options);
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
    async getCycle(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.cycleService.getCycle(id);
    }

    /**
    * @api {get} /cycles/:id/testcases Request test cases for this cycle
    * 
    * @apiName getCycleTestCases
    * @apiGroup Cycles
    * 
    * @apiSuccess {Array} - list of test cases
    */
    async getCycleTestCases(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.cycleService.getCycleTestCases(id);
    }

    /**
     * @api {get} /cycles/:id/testcasestats Request test cases with statistics for this cycle
     * 
     * @apiName getTestCaseStats
     * @apiGroup Cycles
     * 
     * @apiSuccess {Array} - list of test cases
     */
    async getTestCaseStats(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.cycleService.getTestCaseStats(id);
    }

    // ============================================================================

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
    async postCycle(ctx) {
        const value = ctx.request.body;
        value.user = ctx.params.user;
        ctx.body = await this.cycleService.postCycle(value);
    }


    // ============================================================================

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
    async putCycle(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        value.user = ctx.params.user;
        ctx.body = await this.cycleService.putCycle(id, value);
    }

    // ============================================================================

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
    async delCycle(ctx) {
        if (!id) {
            throw new Error("You cannot delete what you don't know to exist. Invalid ID.");
        }
        const id = ctx.params.id;
        ctx.body = await this.cycleService.delCycle(id);
    }

    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.get('/cycles', this.getCycles.bind(this));
        this.router.get('/cycles/:id', this.getCycle.bind(this));
        this.router.get('/cycles/:id/testcases', this.getCycleTestCases.bind(this));
        this.router.get('/cycles/:id/testcasestats', this.getTestCaseStats.bind(this));

        this.router.post('/cycles', this.postCycle.bind(this));

        this.router.put('/cycles/:id', this.putCycle.bind(this));

        this.router.del('/cycles/:id', this.delCycle.bind(this));
    }
}

module.exports = CycleRestApi;
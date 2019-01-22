const log = require('../helpers/log');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');
const TestCaseService = require('../services/testcase.service');

class TestCaseRestApi {

    constructor(router, db) {
        this.router = router;
        this.testCaseService = new TestCaseService(db);
        log.info("successfully loaded TestCaseRestApi")
    }

    // ============================================================================

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
    async getTestCases(ctx) {
        const options = formatOptionsFromParams(ctx.query);
        const query = formatQueryFromParams(ctx.query);
        const withParentFlag = !!ctx.query.withParentFlag;

        ctx.body = await this.testCaseService.getTestCases(query, options, withParentFlag);
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
    async getTestCase(ctx) {
        const id = ctx.params.id;
        const withParentFlag = ctx.query.withParentFlag && ctx.query.withParentFlag.toLowerCase() === 'true';
        ctx.body = await this.testCaseService.getTestCase(id, withParentFlag);
    }

    // ============================================================================

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
    async postTestCase(ctx) {
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.testCaseService.postTestCase(value);
        ctx.status = 201;
    }



    // ============================================================================

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
    async putTestCase(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.testCaseService.putTestCase(id, value);
    }


    // ============================================================================

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
    async delTestCase(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.testCaseService.delTestCase(id);
    }

    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.get('/testcases', this.getTestCases.bind(this));
        this.router.get('/testcases/:id', this.getTestCase.bind(this));

        this.router.put('/testcases/:id', this.putTestCase.bind(this));

        this.router.post('/testcases', this.postTestCase.bind(this));

        this.router.del('/testcases/:id', this.delTestCase.bind(this));
    }
}

module.exports = TestCaseRestApi;
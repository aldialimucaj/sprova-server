const ExecutionService = require('../services/execution.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');
const log = require('../helpers/log');

class ExecutionRestApi {

    constructor(router, db) {
        this.executionService = new ExecutionService(db);
        this.router = router;
        log.info("successfully loaded ExecutionRestApi")
    }

    // ============================================================================

    /**
     * @api {get} /executions Request executions
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/executions?limit=10&skip=0
     * 
     * @apiParam {Number} limit limit result number
     * @apiParam {Number} skip skip first N results
     * @apiParam {Object} sort sort by field ie. { title: 1 }
     * 
     * @apiName getExecutions
     * @apiGroup Executions
     * 
     * @apiSuccess {Array} - list of executions
     */
    async getExecutions(ctx) {
        const query = formatQueryFromParams(ctx.query);
        const options = formatOptionsFromParams(ctx.query);
        
        ctx.body = await this.executionService.getExecutions(query, options);
    }

    /**
     * @api {get} /executions/:id Request execution
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/executions/5af582d1dccd6600137334a0
     * 
     * @apiName getExecution
     * @apiGroup Executions
     * 
     * @apiParam {Number} id execution's unique ID.
     * 
     * @apiSuccess {String} title
     * @apiSuccess {String} description
     */
    async getExecution(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.executionService.getExecution(id);
    }

    // ============================================================================

    /**
     * @api {post} /executions Post new execution
     * 
     * @apiExample {curl} Example usage:
     *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/executions 
     * 
     * @apiName postExecution
     * @apiGroup Executions
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
     * @apiSuccess {String} _id ID of newly added element
     */
    async postExecution(ctx) {
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.executionService.postExecution(value);
        ctx.status = 201;
    }


    // ============================================================================

    /**
     * @api {put} /executions/:id Edit execution
     * 
     * @apiExample {curl} Example usage:
     *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0 
     * 
     * @apiName putExecution
     * @apiGroup Executions
     * 
     * @apiParam {Number} id execution's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     * @apiSuccess {String} _id ID of edited element
     */
    async putExecution(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.executionService.putExecution(id, value);
    }

    /**
     * @api {put} /executions/:id/status Edit execution status
     * 
     * @apiExample {curl} Example usage:
     *     curl -X PUT -d '{"status":"SUCCESSFUL"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0 
     * 
     * @apiName putExecutionStatus
     * @apiGroup Executions
     * 
     * @apiParam {Number} id execution's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     * @apiSuccess {String} _id ID of edited element
     */
    async putExecutionStatus(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.executionService.putExecutionStatus(id, value);
    }

    /**
     * @api {put} /executions/:id/steps/:stepIdx Edit execution step
     * 
     * @apiExample {curl} Example usage:
     *     curl -X PUT -d '{"status":"SUCCESSFUL"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0
     * 
     * @apiName putStepUpdate
     * @apiGroup Executions
     * 
     * @apiParam {Number} id execution's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     * @apiSuccess {String} _id ID of edited element
     */
    async putStepUpdate(ctx) {
        const id = ctx.params.id;
        const stepIdx = ctx.params.stepIdx;
        const value = ctx.request.body;

        ctx.body = await this.executionService.putStepUpdate(id, stepIdx, value);
    }

    /**
    * @api {put} /executions/:id/steps/:stepIdx/status Edit execution step status
    * 
    * @apiExample {curl} Example usage:
    *     curl -X PUT -d '{"status":"SUCCESSFUL"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0
    * 
    * @apiName putStepStatus
    * @apiGroup Executions
    * 
    * @apiParam {Number} id execution's unique ID.
    * 
    * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
    * @apiSuccess {String} _id ID of edited element
    */
    async putStepStatus(ctx) {
        const id = ctx.params.id;
        const stepIdx = ctx.params.stepIdx;
        const value = ctx.request.body;

        ctx.body = await this.executionService.putStepStatus(id, stepIdx, value);
    }

    /**
     * @api {put} /executions/:id/steps/:stepIdx/artifacts Edit execution step status
     * 
     * @apiExample {curl} Example usage:
     *     curl -X PUT -d '{"status":"SUCCESSFUL"}' -H "Content-Type: application/json" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0/artifacts
     * 
     * @apiName putStepUpdateArtifact
     * @apiGroup Executions
     * 
     * @apiParam {Number} id execution's unique ID
     * @apiParam {Number} stepIdx execution step index
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     * @apiSuccess {String} _id ID of edited element
     */
    async putStepUpdateArtifact(ctx) {
        const id = ctx.params.id;
        const stepIdx = ctx.params.stepIdx;
        const value = ctx.request.body;
        value.files = ctx.request.files;
        value.user = ctx.state.user;

        ctx.body = await this.executionService.putStepUpdateArtifact(id, stepIdx, value);
    }



    // ============================================================================

    /**
     * @api {del} /executions/:id Delete execution
     * 
     * @apiExample {curl} Example usage:
     *     curl -X DEL http://localhost/api/executions/5af582d1dccd6600137334a0
     * 
     * @apiName delExecution
     * @apiGroup Executions
     * 
     * @apiParam {Number} id execution's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     */
    async delExecution(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.executionService.delExecution(id);
    }


    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.get('/executions', this.getExecutions.bind(this));
        this.router.get('/executions/:id', this.getExecution.bind(this));

        this.router.post('/executions', this.postExecution.bind(this));

        this.router.put('/executions/:id', this.putExecution.bind(this));
        this.router.put('/executions/:id/status', this.putExecutionStatus.bind(this));
        this.router.put('/executions/:id/steps/:stepIdx', this.putStepUpdate.bind(this));
        this.router.put('/executions/:id/steps/:stepIdx/status', this.putStepStatus.bind(this));
        this.router.put('/executions/:id/steps/:stepIdx/artifacts', this.putStepUpdateArtifact.bind(this));

        this.router.del('/executions/:id', this.delExecution.bind(this));
    }
}

module.exports = ExecutionRestApi;
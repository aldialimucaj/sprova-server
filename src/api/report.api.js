const Router = require('koa-router');
const reportService = require('../services/report.service');

const reportRouter = new Router();

/**
 * @api {get} /reports/projects/:id Request project reports
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/reports/projects/5af582d1dccd6600137334a0
 * 
 * 
 * @apiName getProjectReport
 * @apiGroup Reports
 * 
 * @apiSuccess {Object} - report data
 */
reportRouter.get('/projects/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await reportService.getProjectReport(id);
});

/**
 * @api {get} /reports/cycles/:id Request cycle reports
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/reports/cycles/5af582d1dccd6600137334a0
 * 
 * 
 * @apiName getCycleReport
 * @apiGroup Reports
 * 
 * @apiSuccess {Object} - report data
 */
reportRouter.get('/cycles/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await reportService.getCycleReport(id);
});

/**
 * @api {get} /reports/testsets/:id Request test set reports
 * 
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/api/reports/testsets/5af582d1dccd6600137334a0
 * 
 * 
 * @apiName getTestSetReport
 * @apiGroup Reports
 * 
 * @apiSuccess {Object} - report data
 */
reportRouter.get('/testsets/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await reportService.getTestSetReport(id);
});

module.exports = reportRouter;
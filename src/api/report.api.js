const log = require('../helpers/log');
const ReportService = require('../services/report.service');

class ReportRestApi {
    constructor(router, db) {
        this.router = router;
        this.reportService = new ReportService(db);
        log.info("successfully loaded ReportRestApi")
    }

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
    async getProjectReport(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.reportService.getProjectReport(id);
    }

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
    async getCycleReport(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.reportService.getCycleReport(id);
    }

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
    async getTestSetReport(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.reportService.getTestSetReport(id);
    }

    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.get('/reports/projects/:id', this.getProjectReport.bind(this));
        this.router.get('/reports/cycles/:id', this.getCycleReport.bind(this));
        this.router.get('/reports/testsets/:id', this.getTestSetReport.bind(this));
    }
}

module.exports = ReportRestApi;
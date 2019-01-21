const log = require('../helpers/log');
const ProjectService = require('../services/project.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

class ProjectRestApi {

    constructor(router, db) {
        this.router = router;
        this.projectService = new ProjectService(db);
        log.info("successfully loaded ProjectRestApi")
    }

    // ============================================================================

    /**
     * @api {get} /projects Request projects
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/projects?limit=10&skip=0
     * 
     * @apiParam {Number} limit limit result number
     * @apiParam {Number} skip skip first N results
     * @apiParam {Object} sort sort by field ie. { title: 1 }
     * 
     * @apiName getProjects
     * @apiGroup Projects
     * 
     * @apiSuccess {Array} - list of projects
     */
    async getProjects(ctx) {
        const query = formatQueryFromParams(ctx.query);
        const options = formatOptionsFromParams(ctx.query);

        ctx.body = await this.projectService.getProjects(query, options);
    }

    /**
     * @api {get} /projects/:id Request project
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/projects/5af582d1dccd6600137334a0
     * 
     * @apiName getProject
     * @apiGroup Projects
     * 
     * @apiParam {Number} id project's unique ID.
     * 
     * @apiSuccess {String} title
     * @apiSuccess {String} description
     */
    async getProject(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.projectService.getProject(id);
    }

    /**
    * @api {get} /projects/:id/cycles Request project cycles
    * 
    * @apiExample {curl} Example usage:
    *     curl -i http://localhost/api/projects/5af582d1dccd6600137334a0/cycles
    * 
    * @apiName getCyclesByProjectId
    * @apiGroup Projects
    * 
    * @apiParam {Number} id project's unique ID.
    * 
    * @apiSuccess {String} title
    * @apiSuccess {String} description
    */
    async getCyclesByProjectId(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.projectService.getCyclesByProjectId(id);
    }

    /**
    * @api {get} /projects/:id/cycles Request project test cases
    * 
    * @apiExample {curl} Example usage:
    *     curl -i http://localhost/api/projects/5af582d1dccd6600137334a0/testcases
    * 
    * @apiName getTestCasesByProjectId
    * @apiGroup Projects
    * 
    * @apiParam {Number} id project's unique ID.
    * 
    * @apiSuccess {String} title
    * @apiSuccess {String} description
    */
    async getTestCasesByProjectId(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.projectService.getTestCasesByProjectId(id);
    }

    // ============================================================================

    /**
     * @api {post} /projects Post new project
     * 
     * @apiExample {curl} Example usage:
     *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/projects 
     * 
     * @apiName postProject
     * @apiGroup Projects
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
     * @apiSuccess {String} _id ID of newly added element
     */
    async postProject(ctx) {
        const value = ctx.request.body;
        value.user = ctx.params.user;
        ctx.body = await this.projectService.postProject(value);
        ctx.status = 201;
    }

    // ============================================================================

    /**
     * @api {put} /projects/:id Edit project
     * 
     * @apiExample {curl} Example usage:
     *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/projects/5af582d1dccd6600137334a0 
     * 
     * @apiName putProject
     * @apiGroup Projects
     * 
     * @apiParam {Number} id project's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     * @apiSuccess {String} _id ID of edited element
     */
    async putProject(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        value.user = ctx.params.user;
        ctx.body = await this.projectService.putProject(id, value);
    }


    // ============================================================================

    /**
     * @api {del} /projects/:id Delete project
     * 
     * @apiExample {curl} Example usage:
     *     curl -X DEL http://localhost/api/projects/5af582d1dccd6600137334a0
     * 
     * @apiName delProject
     * @apiGroup Projects
     * 
     * @apiParam {Number} id project's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     */
    async delProject(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.projectService.delProject(id);
    }

    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */


    register() {
        this.router.get('/projects', this.getProjects.bind(this));
        this.router.get('/projects/:id', this.getProject.bind(this));
        this.router.get('/projects/:id/cycles', this.getCyclesByProjectId.bind(this));
        this.router.get('/projects/:id/testcases', this.getTestCasesByProjectId.bind(this));

        this.router.put('/projects/:id', this.putProject.bind(this));

        this.router.post('/projects', this.postProject.bind(this));

        this.router.del('/projects/:id', this.delProject.bind(this));
    }
}

module.exports = ProjectRestApi;
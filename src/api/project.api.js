const Router = require('koa-router');
const projectService = require('../services/project.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const projectRouter = new Router();

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
projectRouter.get('/', async (ctx) => {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await projectService.getProjects(query, options);
});

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
projectRouter.get('/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await projectService.getProject(id);
});

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
projectRouter.get('/:id/cycles', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await projectService.getCyclesByProjectId(id);
});

/**
 * @api {get} /projects/:id/testcases Request project test cases
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
projectRouter.get('/:id/testcases', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await projectService.getTestCasesByProjectId(id);
});

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
projectRouter.put('/:id', async (ctx) => {
    const id = ctx.params.id;
    const value = ctx.request.body;
    value.user = ctx.state.user;
    ctx.body = await projectService.putProject(id, value);
});

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
projectRouter.post('/', async (ctx) => {
    const value = ctx.request.body;
    value.user = ctx.state.user;
    ctx.body = await projectService.postProject(value);
    ctx.status = 201;
});

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
projectRouter.del('/:id', async (ctx) => {
    const id = ctx.params.id;
    ctx.body = await projectService.delProject(id);
});

module.exports = projectRouter;
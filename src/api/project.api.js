const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');
const projectService = require('../services/project.service');
const { formatIDs, formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

const projectRouter = new Router();

projectRouter.get('/projects', getProjects);
projectRouter.get('/projects/:id', getProject);
projectRouter.put('/projects/:id', putProject);
projectRouter.post('/projects', postProject);
projectRouter.del('/projects/:id', deleteProject);

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
async function getProjects(ctx) {
    const query = formatQueryFromParams(ctx.query);
    const options = formatOptionsFromParams(ctx.query);

    ctx.body = await projectService.getProjects(query, options);
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
async function getProject(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    ctx.body = await projectService.getProject(_id);
}

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
async function putProject(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    const value = ctx.request.body;
    ctx.body = await projectService.putProject(_id, formatIDs(value));
}

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
async function postProject(ctx) {
    const value = ctx.request.body;
    value.createdAt = new Date();
    ctx.body = await projectService.postProject(formatIDs(value));
    ctx.status = 201;
}

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
async function deleteProject(ctx) {
    const { id } = ctx.params;
    const _id = ObjectId(id);
    ctx.body = await projectService.delProject(_id);
}

module.exports = projectRouter;
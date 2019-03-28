const Router = require('koa-router');

const artifactApi = require('../api/artifact.api');
const cycleApi = require('../api/cycle.api');
const executionApi = require('../api/execution.api');
const executionContextApi = require('../api/execution-context.api');
const projectApi = require('../api/project.api');
const reportApi = require('../api/report.api');
const searchApi = require('../api/search.api');
const testCaseApi = require('../api/testcase.api');
const userApi = require('../api/user.api');

const apiRouter = new Router({
    prefix: '/api'
});

apiRouter.use(artifactApi.routes(), artifactApi.allowedMethods());
apiRouter.use(cycleApi.routes(), cycleApi.allowedMethods());
apiRouter.use(executionApi.routes(), executionApi.allowedMethods());
apiRouter.use(executionContextApi.routes(), executionContextApi.allowedMethods());
apiRouter.use(projectApi.routes(), projectApi.allowedMethods());
apiRouter.use('/reports', reportApi.routes(), reportApi.allowedMethods());
apiRouter.use('/search', searchApi.routes(), searchApi.allowedMethods());
apiRouter.use(testCaseApi.routes(), testCaseApi.allowedMethods());
apiRouter.use(userApi.routes(), userApi.allowedMethods());

module.exports = apiRouter;
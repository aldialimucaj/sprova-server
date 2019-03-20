const Router = require('koa-router');

const artifactApi = require('../api/artifact.api');
const cycleApi = require('../api/cycle.api');
const executionApi = require('../api/execution.api');
const projectApi = require('../api/project.api');
const reportApi = require('../api/report.api');
const searchApi = require('../api/search.api');
const testCaseApi = require('../api/testcase.api');
const testSetApi = require('../api/testset.api');
const testSetExecutionApi = require('../api/testset-execution.api');
const userApi = require('../api/user.api');

const apiRouter = new Router({
    prefix: '/api'
});

apiRouter.use('/artifacts', artifactApi.routes(), artifactApi.allowedMethods());
apiRouter.use('/cycles', cycleApi.routes(), cycleApi.allowedMethods());
apiRouter.use('/executions', executionApi.routes(), executionApi.allowedMethods());
apiRouter.use('/projects', projectApi.routes(), projectApi.allowedMethods());
apiRouter.use('/reports', reportApi.routes(), reportApi.allowedMethods());
apiRouter.use('/search', searchApi.routes(), searchApi.allowedMethods());
apiRouter.use('/testcases', testCaseApi.routes(), testCaseApi.allowedMethods());
apiRouter.use('/testset-executions', testSetExecutionApi.routes(), testSetExecutionApi.allowedMethods());
apiRouter.use('/testsets', testSetApi.routes(), testSetApi.allowedMethods());
apiRouter.use('/users', userApi.routes(), userApi.allowedMethods());

module.exports = apiRouter;
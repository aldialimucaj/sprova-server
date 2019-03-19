const { name, version } = require('../package.json');

const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json')
const jwt = require('koa-jwt');
const koaLogger = require('koa-bunyan');
const send = require('koa-send');
const cors = require('@koa/cors');
const koaBody = require('koa-body');

const log = require('./helpers/log');
const dbm = require('./helpers/db');

const Authenticator = require('./helpers/auth');

// REST API
const artifactApi = require('./api/artifact.api');
const cycleApi = require('./api/cycle.api');
const executionApi = require('./api/execution.api');
const projectApi = require('./api/project.api');
const reportApi = require('./api/report.api');
const searchApi = require('./api/search.api');
const testCaseApi = require('./api/testcase.api');
const testSetApi = require('./api/testset.api');
const testSetExecutionApi = require('./api/testset-execution.api');
const userApi = require('./api/user.api');

const artifactService = require('./services/artifact.service');
const cycleService = require('./services/cycle.service');
const executionService = require('./services/execution.service');
const projectService = require('./services/project.service');
const reportService = require('./services/report.service');
const testcaseService = require('./services/testcase.service');
const testsetExecutionService = require('./services/testsetExecution.service');
const testsetService = require('./services/testset.service');
const userService = require('./services/user.service');

// GraphQL API
const Schema = require('./graphql/schema');
const TestCaseGraphQL = require('./graphql/testcase.gql');
const ExecutionGraphQL = require('./graphql/execution.gql');

const APP_PORT = process.env.PORT || 8181;
const PRODUCTION = process.env.NODE_ENV === 'production';

const NON_STATIC_ROUTES = [
  '/api',
  '/authenticate',
  '/status'
];

// Koa application
const app = new Koa();

app
  .use(cors({ exposeHeaders: 'Content-Disposition' }))
  .use(koaBody({ multipart: true }))
  .use(koaLogger(log, { level: 'info' }))
  .use(async (ctx, next) => {
    if (NON_STATIC_ROUTES.findIndex(route => ctx.path.startsWith(route)) < 0) {
      return await send(ctx, ctx.path, { root: '/web', index: 'index.html' });
    } else {
      return await next();
    }
  })
  .use(json())
  .use(jwt({ secret: process.env.JWT_SECRET || 'you-hacker!', passthrough: !PRODUCTION }))
  .use(async (ctx) => {
    if (ctx.path.startsWith('/data/artifacts')) {
      await send(ctx, ctx.path, { root: path.join(__dirname, '..') });
    }
  });

// for REST api clients
const apiRouter = new Router({
  prefix: '/api'
});

apiRouter.use(artifactApi);
apiRouter.use(cycleApi);
apiRouter.use(executionApi);
apiRouter.use(projectApi);
apiRouter.use(reportApi);
apiRouter.use(searchApi);
apiRouter.use(testCaseApi);
apiRouter.use(testSetApi);
apiRouter.use(testSetExecutionApi);
apiRouter.use(userApi);

// for frontend clients
const graphQLRouter = new Router({
  prefix: '/graphql'
});

// register GraphQL routes
// ============================================================================
const schema = new Schema(graphQLRouter);

const testCaseGraphQL = new TestCaseGraphQL(graphQLRouter);
const executionGraphQL = new ExecutionGraphQL(graphQLRouter);
schema.addAPIschema(testCaseGraphQL);
schema.addAPIschema(executionGraphQL);

// finalize and register schema
schema.register();

// status page
const statusRouter = new Router({
  prefix: '/status'
});

statusRouter.all('/', (ctx) => ctx.body = { success: true, name, version, serverTime: new Date() });

// Authentication router
const authRouter = new Router();

app
  .use(authRouter.routes())
  .use(apiRouter.routes())
  .use(graphQLRouter.routes())
  .use(statusRouter.routes())
  .use(apiRouter.allowedMethods())
  .use(statusRouter.allowedMethods());

// Asynchronously connect to database
(async function start() {
  log.info('Server connecting to database');
  try {
    await dbm.connect();
    log.info('Successfully established database connection');
  } catch (e) {
    log.error(e);
  }

  log.info('Load database services');
  try {
    await artifactService.load();
    await cycleService.load();
    await executionService.load();
    await projectService.load();
    await reportService.load();
    await testcaseService.load();
    await testsetExecutionService.load();
    await testsetService.load();
    await userService.load();
  } catch (e) {
    log.error(e)
  }

  const auth = new Authenticator();
  auth.init();
  authRouter.post('/authenticate', async (ctx) => {
    await auth.authenticate(ctx);
  });
})();

log.info(`starting server http://0.0.0.0:${APP_PORT}`);
const server = app.listen(APP_PORT);

function stop() {
  server.close();
}

module.exports = server;
module.exports.stop = stop;
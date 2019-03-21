const path = require('path');
const Koa = require('koa');
const json = require('koa-json')
const jwt = require('koa-jwt');
const koaLogger = require('koa-bunyan');
const send = require('koa-send');
const cors = require('@koa/cors');
const koaBody = require('koa-body');

const log = require('./helpers/log');
const dbm = require('./helpers/db');

const apiRouter = require('./routers/api.router');
const authRouter = require('./routers/auth.router');
const graphQLRouter = require('./routers/graphql.router');
const statusRouter = require('./routers/status.router');

const artifactService = require('./services/artifact.service');
const authService = require('./helpers/auth');
const cycleService = require('./services/cycle.service');
const executionService = require('./services/execution.service');
const executionContextService = require('./services/execution-context.service');
const projectService = require('./services/project.service');
const reportService = require('./services/report.service');
const testcaseService = require('./services/testcase.service');
const testsetExecutionService = require('./services/testset-execution.service');
const testsetService = require('./services/testset.service');
const userService = require('./services/user.service');

// const testCaseGraphQL = require('./graphql/testcase.gql');
// const executionGraphQL = require('./graphql/execution.gql');

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
  .use(authRouter.routes())
  .use(jwt({ secret: process.env.JWT_SECRET || 'you-hacker!', passthrough: !PRODUCTION }))
  .use(apiRouter.routes())
  .use(graphQLRouter.routes())
  .use(statusRouter.routes())
  .use(json())
  .use(apiRouter.allowedMethods())
  .use(statusRouter.allowedMethods())
  .use(async (ctx) => {
    if (ctx.path.startsWith('/data/artifacts')) {
      await send(ctx, ctx.path, { root: path.join(__dirname, '..') });
    }
  });

// Boot server
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
    await authService.load();
    await artifactService.load();
    await cycleService.load();
    await executionService.load();
    await executionContextService.load();
    await projectService.load();
    await reportService.load();
    await testcaseService.load();
    await testsetExecutionService.load();
    await testsetService.load();
    await userService.load();
    log.info('Successfully loaded database services');
  } catch (e) {
    log.error(e)
  }

  // log.info('Load GraphQL services');
  // try {
  //   await testCaseGraphQL.load();
  //   await executionGraphQL.load();
  // } catch (e) {
  //   log.error(e)
  // }
  
})();

log.info(`Starting server http://0.0.0.0:${APP_PORT}`);
  const server = app.listen(APP_PORT);

  function stop() {
    server.close();
  }

  module.exports = server;
  module.exports.stop = stop;
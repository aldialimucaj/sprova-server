const { name, version } = require('../package.json');
const config = require('./config/index');

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
const utils = require('./helpers/utils');
const DatabaseManager = require('./helpers/db');
const databaseManager = new DatabaseManager(config)

const Authenticator = require('./helpers/auth');

// REST API
const UserRestApi = require('./api/user.api');
const ProjectRestApi = require('./api/project.api');
const CycleRestApi = require('./api/cycle.api');
const TestSetRestApi = require('./api/testset.api');
const TestCaseRestApi = require('./api/testcase.api');
const ExecutionRestApi = require('./api/execution.api');
const TestSetExecutionRestApi = require('./api/testset-execution.api');
const ArtifactRestApi = require('./api/artifact.api');
const ReportRestApi = require('./api/report.api');

// GraphQL API
const Schema = require('./graphql/schema');
const TestCaseGraphQL = require('./graphql/testcase.gql');
const ExecutionGraphQL = require('./graphql/execution.gql');

const APP_PORT = process.env.PORT || 8181;
const PRODUCTION = process.env.NODE_ENV === 'production' ? true : false;

const app = new Koa();

// for REST api clients
const apiRouter = new Router({
  prefix: '/api'
});

// for frontend clients
const graphQLRouter = new Router({
  prefix: '/graphql'
});


// status page
const statusRouter = new Router({
  prefix: '/status'
});

statusRouter.all('/', (ctx) => ctx.body = { success: true, name, version, serverTime: new Date() });

const authRouter = new Router();

(async function start() {
  try {
    var db = null;
    while (!db) {
      log.info("server connecting to database");
      db = await databaseManager.connect();
      if (db) {
        log.info("successfully established database connection");
      } else {
        await utils.timeout(1000);
      }
    }

    // Authenticator 
    // ============================================================================

    const auth = new Authenticator(db);
    auth.init();
    authRouter.post('/authenticate', async (ctx) => {
      await auth.authenticate(ctx);
    });

    // Initialize API routes
    // ============================================================================
    const artifactAPI = new ArtifactRestApi(apiRouter, db);
    const cycleAPI = new CycleRestApi(apiRouter, db);
    const executionAPI = new ExecutionRestApi(apiRouter, db);
    const projectAPI = new ProjectRestApi(apiRouter, db);
    const reportAPI = new ReportRestApi(apiRouter, db);
    const testSetAPI = new TestSetRestApi(apiRouter, db);
    const testCaseAPI = new TestCaseRestApi(apiRouter, db);
    const testSetExecutionAPI = new TestSetExecutionRestApi(apiRouter, db);
    const userAPI = new UserRestApi(apiRouter, db);

    // register REST API routes
    artifactAPI.register();
    cycleAPI.register();
    executionAPI.register();
    projectAPI.register();
    reportAPI.register();
    testSetAPI.register();
    testCaseAPI.register();
    testSetExecutionAPI.register();
    userAPI.register();

    // register GraphQL routes
    // ============================================================================
    const schema = new Schema(graphQLRouter);

    const testCaseGraphQL = new TestCaseGraphQL(graphQLRouter, db);
    const executionGraphQL = new ExecutionGraphQL(graphQLRouter, db);
    schema.addAPIschema(testCaseGraphQL);
    schema.addAPIschema(executionGraphQL);

    // finalize and register schema
    schema.register();

  } catch (e) {
    log.error(e);
  }
})();


// APP middlewares 
// ============================================================================
app
  .use(cors())
  .use(koaBody({ multipart: true }))
  .use(koaLogger(log, { level: 'info' }))
  .use(authRouter.routes())
  .use(jwt({ secret: process.env.JWT_SECRET || 'you-hacker!', passthrough: !PRODUCTION }))
  .use(apiRouter.routes())
  .use(graphQLRouter.routes())
  .use(statusRouter.routes())
  .use(json())
  .use(async (ctx) => {
    if (ctx.path.startsWith('/data/artifacts')) {
      await send(ctx, ctx.path, { root: path.join(__dirname, '..') });
    }
  })
  .use(apiRouter.allowedMethods())
  .use(statusRouter.allowedMethods());


log.info(`starting server http://0.0.0.0:${APP_PORT}`);

const server = app.listen(APP_PORT);

function stop() {
  server.close();
}

module.exports = server;
module.exports.stop = stop;
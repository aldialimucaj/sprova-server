const Router = require('koa-router');

const Schema = require('../graphql/schema');
const TestCaseGraphQL = require('../graphql/testcase.gql');
const ExecutionGraphQL = require('../graphql/execution.gql');

const graphQLRouter = new Router({
    prefix: '/graphql'
});

const schema = new Schema(graphQLRouter);

const testCaseGraphQL = new TestCaseGraphQL(graphQLRouter);
const executionGraphQL = new ExecutionGraphQL(graphQLRouter);
schema.addAPIschema(testCaseGraphQL);
schema.addAPIschema(executionGraphQL);

schema.register();

module.exports = graphQLRouter;
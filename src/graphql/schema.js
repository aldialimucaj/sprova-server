const graphqlHTTP = require('koa-graphql');
const graphql = require('graphql');
const log = require('../helpers/log');
const production = process.env.NODE_ENV === 'production';

class Schema {
    constructor(router) {
        this.router = router;
        this.queries = {};
        this.mutations = {};
    }

    addQuery(query) {
        this.queries = Object.assign({}, this.queries, query);
    }

    addMutation(mutation) {
        this.mutations = Object.assign({}, this.mutations, mutation);
    }

    addAPIschema(schema) {
        let queries = schema.createQueries();
        this.addQuery(queries);

        let mutations = schema.createMutations();
        this.addMutation(mutations);
        log.info(`successfully registered schema for ${schema.constructor.name}`)
    }

    finalizeSchema() {
        this.queryObjectType = new graphql.GraphQLObjectType({
            name: 'Query',
            fields: this.queries
        });

        this.mutationObjectType = new graphql.GraphQLObjectType({
            name: 'Mutation',
            fields: this.mutations
        });

        let schema = new graphql.GraphQLSchema({
            query: this.queryObjectType,
            mutation: this.mutationObjecType
        });

        return schema;
    }

    register() {
        this.router.all('/', graphqlHTTP({
            schema: this.finalizeSchema(),
            graphiql: !production
        }));
        log.info("successfully loaded GraphQL Schema")
    }
}


module.exports = Schema;
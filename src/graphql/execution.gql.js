const log = require('../helpers/log');
const dbm = require('../helpers/db');
const graphql = require('graphql');
const ObjectId = require('mongodb').ObjectId
const GraphQLDateTime = require('graphql-iso-date').GraphQLDateTime;
var Executions = undefined;

class ExecutionGraphQL {
    constructor(router) {
        this.router = router;
        Executions = dbm.getCollection('executions');

        log.info("successfully loaded ExecutionGraphQL")
    }

    /**
     * Create GraphQL query fields.
     * This fields go to the public GraphQL API.
     */
    createQueries() {
        if (!this.fields) {
            this.fields = {
                executions: {
                    type: new graphql.GraphQLList(ExecutionType),
                    resolve: async () => {
                        const result = await Executions.find().toArray();
                        return result;
                    }
                },
                structuredExecutions: {
                    type: new graphql.GraphQLList(ExecutionType),
                    resolve: async () => {
                        let result = await Executions.find().toArray();
                        return result;
                    }
                },
                execution: {
                    type: ExecutionType,
                    args: {
                        id: {
                            name: 'id',
                            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                        }
                    },
                    resolve: async (parent, args) => {
                        let execution = await Executions.findOne({ _id: ObjectId(args.id) });

                        return execution;
                    }
                }
            }
        }

        return this.fields;
    }

    /**
     * Create GraphQL mutation fields.
     * This fields go to the public GraphQL API
     */
    createMutations() {
        this.mutations = {};

        return this.mutations;
    }
}

/**
 * Type for queries
 */
const ExecutionType = new graphql.GraphQLObjectType({
    name: 'execution',
    fields: function () {
        return ExecutionFields
    }
});

const ExecutionStepType = new graphql.GraphQLObjectType({
    name: 'executionStep',
    fields: function () {
        return ExecutionStepFields
    }
});


/**
 * Execution fields. Represents GraphQL model.
 */
const ExecutionFields = {
    _id: {
        type: graphql.GraphQLID
    },
    title: {
        type: graphql.GraphQLString
    },
    description: {
        type: graphql.GraphQLString
    },
    status: {
        type: graphql.GraphQLString
    },
    executionType: {
        type: graphql.GraphQLString
    },
    testSteps: {
        type: graphql.GraphQLList(ExecutionStepType)
    },

    projectId: {
        type: graphql.GraphQLString
    },
    cycleId: {
        type: graphql.GraphQLString
    },

    createdAt: {
        type: GraphQLDateTime
    },
    updatedAt: {
        type: GraphQLDateTime
    }
};

// TODO add artifacts
const ExecutionStepFields = {
    action: {
        type: graphql.GraphQLString
    },
    payload: {
        type: graphql.GraphQLString
    },
    expected: {
        type: graphql.GraphQLString
    },
    status: {
        type: graphql.GraphQLString
    },
    comment: {
        type: graphql.GraphQLString
    },
    updatedAt: {
        type: GraphQLDateTime
    }
};

module.exports = ExecutionGraphQL;
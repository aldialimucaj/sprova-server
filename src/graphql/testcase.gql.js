const graphql = require('graphql');
const dbm = require('../helpers/db');
const log = require('../helpers/log');
const ObjectId = require('mongodb').ObjectId
var TestCases = undefined;

class TestCaseGraphQL {
    constructor(router) {
        this.name = 'TestCaseGraphQL';
        this.router = router;
    }

    async load() {
        TestCases = dbm.getCollection('testcases');
        log.info("Successfully loaded TestCaseGraphQL");
    }

    /**
     * Create GraphQL query fields.
     * This fields go to the public GraphQL API.
     */
    createQueries() {
        if (!this.fields) {
            this.fields = {
                testcases: {
                    type: new graphql.GraphQLList(TestCaseType),
                    resolve: async () => {
                        const result = await TestCases.find().toArray();
                        return result;
                    }
                },
                structuredTestcases: {
                    type: new graphql.GraphQLList(TestCaseType),
                    resolve: async () => {
                        let fetchChildren = async (parent) => {
                            let children = await TestCases.find({parentId: ObjectId(parent._id)}).toArray();
                            parent.children = await children.map( async (child) => { 
                                return await fetchChildren(child);
                            });
                            return parent;
                        }
                        
                        let result = await TestCases.find({parentId: null}).toArray();
                        result = result.map(testcase => fetchChildren(testcase));
                        return result;
                    }
                },
                testcase: {
                    type: TestCaseType,
                    args: {
                        id: {
                            name: 'id',
                            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                        }
                    },
                    resolve: async (parent, args) => {
                        let testcase = await TestCases.findOne({ _id: args.id });

                        return testcase;
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
const TestCaseType = new graphql.GraphQLObjectType({
    name: 'testCase',
    fields: function () {
        return TestCaseFields
    }
});

const TestCaseStepType = new graphql.GraphQLObjectType({
    name: 'testCaseStep',
    fields: function () {
        return TestCaseStepFields
    }
});



/**
 * TestCase fields. Represents GraphQL model.
 */
const TestCaseFields = {
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
    testSteps: {
        type: graphql.GraphQLList(TestCaseStepType)
    },
    projectId: {
        type: graphql.GraphQLString
    },

    createdAt: {
        type: graphql.GraphQLString
    },
    updatedAt: {
        type: graphql.GraphQLBoolean
    },

    children: {
        type: graphql.GraphQLList(TestCaseType)
    }
};

const TestCaseStepFields = {
    action: {
        type: graphql.GraphQLString
    },
    payload: {
        type: graphql.GraphQLString
    },
    expected: {
        type: graphql.GraphQLString
    }
};


module.exports = TestCaseGraphQL;
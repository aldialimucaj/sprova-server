const DbType = Object.freeze({
    Artifacts: 'ARTIFACTS',
    Projects: 'PROJECTS',
    Cylcles: 'CYCLES',
    Executions: 'EXECUTIONS',
    TestSets: 'TESTSETS',
    TestCases: 'TESTCASES'
});

const ArtifactType = Object.freeze({
    Execution: 'EXECUTION',
    TestCase: 'TESTCASE'
});

const CycleStatus = Object.freeze({
    Active: 'ACTIVE',
    Abandoned: 'ABANDONED',
    Finished: 'FINISHED',
    Planned: 'PLANNED'
});

const TestSetStatus = Object.freeze({
    Active: 'ACTIVE',
    Abandoned: 'ABANDONED',
    Finished: 'FINISHED',
    Planned: 'PLANNED'
});

const ExecutionStatus = Object.freeze({
    Failed: "FAILED",
    Successful: "SUCCESSFUL",
    Pending: "PENDING",
    Warning: "WARNING",
    Working: "WORKING"
});

const TestSetExecutionStatus = Object.freeze({
    Running: 'RUNNING',
    Abandoned: 'ABANDONED',
    Finished: 'FINISHED',
    Planned: 'PLANNED'
});

const TestStepStatus = Object.freeze({
    Failed: "FAILED",
    Successful: "SUCCESSFUL",
    Pending: "PENDING"
});

const ExecutionType = Object.freeze({
    Automated: "AUTOMATED",
    Manual: "MANUAL",
    ManualAutomated: "MANUAL_AUTOMATED"
});

module.exports = {
    DbType,
    ArtifactType,
    CycleStatus,
    TestSetStatus,
    ExecutionStatus,
    TestSetExecutionStatus,
    TestStepStatus,
    ExecutionType
};
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
    CycleStatus,
    TestSetStatus,
    ExecutionStatus, 
    TestSetExecutionStatus, 
    TestStepStatus,
    ExecutionType 
};
const ObjectId = require('mongodb').ObjectId
const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');
const _ = require('lodash');
const DATA_DIR = './data';
const ARTIFACTS_DIR = DATA_DIR + path.sep + 'artifacts'
const PROJECTS = 'projects';
const CYCLES = 'cycles';
const TESTS = 'tests';
const EXECUTIONS = 'executions';
const { DbType } = require('./enums');

const JWT_SECRET = process.env.JWT_SECRET || 'you-hacker!';

/**
 * Formats output of mongodb insertOne document result
 * 
 * @param {*} response Respone form mongodb 
 */
function formatInsertMany(response) {
    let result = { ok: 0 };
    if (response && response.result) {
        result.ok = response.result.ok;
        result._ids = Object.values(response.insertedIds);
    }

    return result;
}

/**
 * Formats output of mongodb insertOne document result
 * 
 * @param {*} response Respone form mongodb 
 */
function formatInsert(response) {
    let result = { ok: 0 };
    if (response && response.result) {
        result.n = response.result.n;
        result.ok = response.result.ok;
        result._id = response.insertedId;
    }

    return result;
}

/**
 * Formats output of mongodb updateOne document result
 * 
 * @param {*} response Respone form mongodb 
 * @param {String|ObjectId} _id ID of document
 */
function formatUpdate(response, _id) {
    let result = { _id, ok: 0 };
    if (response && response.result) {
        result.ok = response.result.ok;
    }

    return result;
}

/**
 * Formats output of mongodb remove document result
 * 
 * @param {*} response Respone form mongodb 
 * @param {String|ObjectId} _id ID of document
 */
function formatDelete(response, _id) {
    let result = { _id, ok: 0 };
    if (response && response.result) {
        result.ok = response.result.ok;
    }

    return result;
}

/**
 * Formats output of mongodb deleteMany document result
 * 
 * @param {*} response Respone form mongodb 
 * @param {String|ObjectId} isd ID of document
 */
function formatDeleteMany(response, ids) {
    let result = { ids, ok: 0 };
    if (response && response.result) {
        result.ok = response.result.ok;
        result.n = response.deletedCount;
    }

    return result;
}

/**
 * Changes property values of the format valueId to mongo ObjectId value. 
 * This is useful for search and query functions. Functions returns a
 * copy of the original value. 
 * 
 * Example
 * 
 * { "projectId": "5af582d1dccd6600137334a0"}
 * 
 * Will be converted to
 * { "projectId": ObjectId("5af582d1dccd6600137334a0")}
 * 
 * @param {*} value object with ID values
 */
function formatIDs(value) {
    const result = Object.assign({}, value);
    const keys = Object.keys(value);
    for (const key of keys) {
        if ((key.endsWith('Id') || key.endsWith('Ids') ||key === '_id') && isValidObjectId(result[key])) {
            result[key] = ObjectId(result[key]);
        } else if (key.endsWith('Id') && result[key] === 'null') {
            result[key] = null;
        } else if (_.isObject(result[key]) && !_.isArray(result[key]) && key !== 'inheritedFrom' && !(result[key] instanceof Date)) {
            result[key] = formatIDs(result[key]);
        } else if (_.isArray(result[key])) {
            result[key] = result[key].map(e => formatIDs(e));
        }
    }

    return result;
}

/**
 * Test if string is valid Object Id in 24 byte format.
 * 
 * @param {string} value ObjectId string representation
 */
function isValidObjectId(value) {
    let result = true;
    result = result && value !== undefined;
    result = result && value !== null;
    result = result && value.length === 24;
    result = result && value === value.toLowerCase();
    result = result && ObjectId.isValid(value);

    return result;
}

/**
 * Format sort elements from get call parameters input
 * 
 * @param {*} value sort elements
 */
function formatSortElements(value) {
    const result = {};
    const keys = Object.keys(value);
    for (const key of keys) {
        const sortValue = value[key];
        if (sortValue === -1 || sortValue === 'DESC') {
            result[key] = -1;
        } else if (sortValue === 1 || sortValue === 'ASC') {
            result[key] = 1;
        } else {
            throw new Error('Unkown sorting order');
        }
    }

    return result;
}

/**
 * Filter out parameters that are query relevant 
 * 
 * @param {*} value http get params
 */
function formatQueryFromParams(value) {
    const result = Object.assign({}, value);

    // delete options
    delete result.limit;
    delete result.skip;
    delete result.sort;
    delete result.withParentFlag;

    // check for bolean values
    // TODO: dont like this. refactor!
    const keys = Object.keys(result);
    for (const key of keys) {
        if (result[key] === 'true') {
            result[key] = true;
        } else if (result[key] === 'false') {
            result[key] = false;
        }
    }
    // the rest are generic parameters and should be whitelisted

    return formatIDs(result);
}

/**
 * Filter out options for mongo query
 * 
 * @param {*} value http get params
 */
function formatOptionsFromParams(value) {
    const { limit, skip, sort } = value;
    const options = { limit: Number(limit), skip: Number(skip) };
    if (sort) {
        try {
            const sortValue = JSON.parse(sort);
            options.sort = formatSortElements(sortValue);
        } catch (error) {
            throw new Error('formatOptionsFromParams > ' + sort + ' > ' + error);
        }
    }

    return _.omitBy(options, _.isUndefined);
}

// ============================================================================

/**
 * Applies hash algorithm with optional key to password and returns hash value.
 * 
 * @param {*} password 
 * @param {*} key 
 * @returns {string}
 */
function sha512(password, key = JWT_SECRET) {
    var hash = crypto.createHmac('sha512', key);
    hash.update(password);
    return hash.digest('hex');
}

/**
 * Saves file object to disk. 
 * 
 * @param {*} file file
 * @param {*} dstPath destination path
 * @returns {string} full destination path
 */
function saveArtifact(file, dstPath) {
    let result;
    if (!_.isEmpty(file) && dstPath) {
        const folderPath = path.join(ARTIFACTS_DIR, dstPath);
        result = path.join(folderPath, file.name);
        fs.ensureDirSync(folderPath);

        const reader = fs.createReadStream(file.path);
        const writer = fs.createWriteStream(result);
        reader.pipe(writer);
    }

    return result;
}

/**
 * Delete artifact from hdd. This does not remove the database metadata.
 * 
 * @param {*} artifact 
 * @returns {Promise}
 */
function removeArtifact(artifact) {
    // TODO Sanitize
    return fs.remove(artifact.filePath);
}

/**
 * Read artifact content form fs and return a stream
 * @param {*} artifact 
 */
function readArtifact(artifact) {
    return fs.createReadStream(artifact.filePath);
}

/**
 * Returns full path for execution. Usually used to save artifacts.
 * 
 * @param {Execution} execution object
 * @param {ObjectId} projectId 
 * @returns {string} full path
 */
function executionToPath(execution, projectId) {
    const projectPath = path.join(PROJECTS, projectId.toString());
    const cyclesPath = path.join(CYCLES, execution.cycleId.toString());
    const testsPath = path.join(TESTS, execution.testCaseId.toString());
    const executionsPath = path.join(EXECUTIONS, execution._id.toString());
    const fullPath = path.join(projectPath, cyclesPath, testsPath, executionsPath);

    return fullPath;
}

/**
 * Returns full path for execution. Usually used to save artifacts.
 * 
 * @param {TestCase} testcase object
 * @param {ObjectId} projectId 
 * @returns {string} full path
 */
function testCaseToPath(testCase, projectId) {
    const projectPath = path.join(PROJECTS, projectId.toString());
    const cyclesPath = path.join(CYCLES, testCase.cycleId.toString());
    const testsPath = path.join(TESTS, testCase.testCaseId.toString());
    const executionsPath = path.join(EXECUTIONS, testCase._id.toString());
    const fullPath = path.join(projectPath, cyclesPath, testsPath, executionsPath);

    return fullPath;
}

/**
 * Returns full path for execution. Usually used to save artifacts.
 * 
 * @param {Cycle} value object
 * @returns {string} full path
 */
function defineArtifactPath(value) {
    let subPaths = [];

    if (value.projectId) {
        const projectPath = path.join(DbType.Projects.toLowerCase(), value.projectId.toString());
        subPaths = subPaths.concat(projectPath);
    }
    if (value.cycleId) {
        const cyclesPath = path.join(DbType.Cylcles.toLowerCase(), value.cycleId.toString());
        subPaths = subPaths.concat(cyclesPath);
    }
    if (value.testCaseId) {
        const testCasePath = path.join(DbType.TestCases.toLowerCase(), value.testCaseId.toString());
        subPaths = subPaths.concat(testCasePath);
    }
    if (value.executionId) {
        const executionsPath = path.join(DbType.Executions.toLowerCase(), value.executionId.toString());
        subPaths = subPaths.concat(executionsPath);
    }

    return path.join(...subPaths);
}


// ============================================================================
// Util functions. TODO refactor this!
if (!ObjectId.prototype.valueOf) {
    ObjectId.prototype.valueOf = function () {
        return this.toString();
    };
}
const timeout = ms => new Promise(res => setTimeout(res, ms))

// ============================================================================
exports.formatInsert = formatInsert;
exports.formatInsertMany = formatInsertMany;
exports.formatUpdate = formatUpdate;
exports.formatDelete = formatDelete;
exports.formatDeleteMany = formatDeleteMany;
exports.formatIDs = formatIDs;
exports.isValidObjectId = isValidObjectId;
exports.formatQueryFromParams = formatQueryFromParams;
exports.formatOptionsFromParams = formatOptionsFromParams;
exports.sha512 = sha512;
exports.saveArtifact = saveArtifact;
exports.readArtifact = readArtifact;
exports.removeArtifact = removeArtifact;
exports.executionToPath = executionToPath;
exports.testCaseToPath = testCaseToPath;
exports.defineArtifactPath = defineArtifactPath;
exports.timeout = timeout;
const ObjectId = require('mongodb').ObjectId
const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');
const DATA_DIR = './data';
const ARTIFACTS_DIR = DATA_DIR + path.sep + 'artifacts'
const PROJECTS = 'projects';
const CYCLES = 'cycles';
const TESTS = 'tests';
const EXECUTIONS = 'executions';


/**
 * Formats output of mongodb insertOne document result
 * 
 * @param {*} response Respone form mongodb 
 */
function formatInsert(response) {
    let result = { ok: 0 };
    if (response && response.result) {
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
function formatRemove(response, _id) {
    let result = { _id, ok: 0 };
    if (response && response.result) {
        result.ok = response.result.ok;
    }

    return result;
}

/**
 * Applies hash algorithm with optional key to password and returns hash value.
 * 
 * @param {*} password 
 * @param {*} key 
 * @returns {string}
 */
function sha512(password, key = '') {
    var hash = crypto.createHmac('sha512', key);
    hash.update(password);
    var value = hash.digest('hex');
    return value;
}

/**
 * Saves file object to disk. 
 * 
 * @param {*} file file
 * @param {*} dstPath destination path
 * @returns {string} full destination path
 */
function saveArtifact(file, dstPath) {
    const folderPath = path.join(ARTIFACTS_DIR, dstPath);
    const filePath = path.join(folderPath, file.name);
    fs.ensureDirSync(folderPath);

    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(filePath);
    reader.pipe(writer);

    return filePath;
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
exports.formatUpdate = formatUpdate;
exports.formatRemove = formatRemove;
exports.sha512 = sha512;
exports.saveArtifact = saveArtifact;
exports.executionToPath = executionToPath;
exports.timeout = timeout;
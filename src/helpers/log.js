const bunyan = require('bunyan');
const { logLevel } = require('../config');
const { name, version } = require('../../package.json');
const log = bunyan.createLogger({ name, version, level: logLevel || 'info' });

module.exports = log;
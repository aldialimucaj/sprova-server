const fs = require('fs');
const path = require("path");
const execMode = process.env.NODE_ENV || 'development';

switch (execMode) {
    case 'development':
    case 'production':
    case 'test':
        break;
    default:
        throw new Error('execution mode should be one of the following [development|production|test]');
}

const configFilePath = path.join(__dirname, `../../config/${execMode}.json`);

if (fs.lstatSync(configFilePath).isFile()) {
    // eslint-disable-next-line global-require
    module.exports = require(configFilePath);
} else {
    throw new Error(configFilePath + ' config file missing')
}
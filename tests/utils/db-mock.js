const config = require('../../src/config');
const ObjectId = require('mongodb').ObjectId
const { MongoMemoryServer } = require('mongodb-memory-server');

var mongod = new MongoMemoryServer({
    instance: {
        debug: true,
        port: config.db.port,
        dbName: config.db.name
    }
});

if(!ObjectId.prototype.valueOf) {
    ObjectId.prototype.valueOf = function () {
        return this.toString();
    };
}

module.exports = mongod;
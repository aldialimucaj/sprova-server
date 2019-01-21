const log = require('./log');
const MongoClient = require('mongodb').MongoClient

class DatabaseManager {

    constructor(config) {
        log.info('initializing DB')
        this.config = config;
    }

    async connect() {
        try {
            log.info('connecting to db %s', this.connectUrl);
            const client = await MongoClient.connect(this.connectUrl, this.config.mongo);
            this.db = client.db(this.config.db.name);
            log.info('successfully connected to db %s', this.connectUrl);
            return this.db;
        } catch (e) {
            log.error('%s at %s', e.message, this.connectUrl);
            return null;
        }
    }

    getDB() {
        return this.db;
    }

    get connectUrl() {
        let db = this.config.db;
        //TODO: handle replicaSets and shards
        return `mongodb://${db.host}:${db.port}/${db.name}`
    }

    async getCollection(name) {
        var collection = undefined;
        if (this.db) {
            collection = await this.db.collection(name);
        } else {
            log.error('trying to open collection without db connection');
        }
        return collection;
    }
}

module.exports = DatabaseManager;
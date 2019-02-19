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
            const client = await MongoClient.connect(this.connectUrl, this.mongoOptions);
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

    get mongoOptions() {
        const options = Object.assign({}, this.config.mongoOptions);

        if (process.env.SPROVA_DB_USERNAME) {
            if (!options.auth) {
                options.auth = {};
            }
            options.auth.user = process.env.SPROVA_DB_USERNAME;
        }

        if (process.env.SPROVA_DB_PASSWORD) {
            options.auth.password = process.env.SPROVA_DB_PASSWORD;
        }

        return options;
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
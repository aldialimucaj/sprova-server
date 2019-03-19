const log = require('./log');
const MongoClient = require('mongodb').MongoClient
const config = require('../config');

class DatabaseManager {

    constructor(config) {
        log.info('Initializing DB')
        this.config = config;
        this.client = new MongoClient();
    }

    //TODO: handle replicaSets and shards
    get connectUrl() {
        const { host, port, name } = this.config.db;
        return this.connectUrl = `mongodb://${host}:${port}/${name}`;
    }

    get mongoOptions() {
        const { mongoOptions } = this.config;
        const { SPROVA_DB_USERNAME, SPROVA_DB_PASSWORD } = process.env;

        const overrides = {
            ...SPROVA_DB_USERNAME && { user: SPROVA_DB_USERNAME },
            ...SPROVA_DB_PASSWORD && { password: SPROVA_DB_PASSWORD }
        }

        return {...mongoOptions, ...overrides};
    }

    /**
     * Asynchronously connect to the database.
     */
    async connect() {
        log.info('Connecting to database %s', this.connectUrl);
        const { name } = this.config.db;
        try {
            await this.client.connect(this.connectUrl, this.mongoOptions);
            this.db = this.client.db(name);
            log.info('Successfully connected to database %s', this.connectUrl);
        } catch (error) {
            log.error('%s at %s', error.message, this.connectUrl);
            throw error;
        }
    }

    /**
     * Disconnect client from database.
     */
    async disconnect() {
        await this.client.close();
    }

    /**
     * Load collection by name.
     * 
     * @param {string} name of the collection to load.
     */
    async getCollection(name) {
        if (!this.db) {
            throw new Error('Trying to open collection without database connection!');
        }
        return await this.db.collection(name);
    }

    /**
     * Get current database object.
     */
    getDB() {
        return this.db;
    }
    
}

module.exports = new DatabaseManager(config);
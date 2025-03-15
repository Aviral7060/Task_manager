require('dotenv').config();
const { MongoClient } = require('mongodb');
const {collection} = require('../constant')
const logger = require('../utils/logger')

const uri = process.env.MONGODB_URL;
const dbName = collection.DB_NAME;
let client; //const test
let db;

async function connectDB() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        logger.info(`connected to DB`)  // Connected to DB
        db = client.db(dbName);
    };
    return db;
}

module.exports = connectDB;   
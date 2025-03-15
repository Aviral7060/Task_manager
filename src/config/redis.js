require('dotenv').config()
const redis = require('ioredis')
const logger = require('../utils/logger')

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

client.on('connect', () => {
    logger.info('connected to redis')
})

client.on('error', (err) => {
    logger.error('not able to connect to redis')
})

module.exports = client;
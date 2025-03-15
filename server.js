const express = require('express');
const morgan = require('morgan')
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const connectDB = require('./src/config/db')  //DBConnect, DBInstance
const client = require('./src/config/redis')
const router = require('./src/routes/index');
const { globalErrorHandler } = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger')

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    req.reqId = uuidv4();
    next();
});

morgan.token("reqId", (req) => req.reqId);
app.use(morgan(':date[iso] :reqId :method :url :status :response-time ms'));
app.use('/api/v1', router)  //naming mainRouter
app.use(globalErrorHandler)

const port = process.env.PORT || 5000;

(async function server() {
    try {
        await connectDB();
        await client.ping();
        app.listen(port, () => {
            logger.info(`server is running on port ${port}`)
        });
    }
    catch (error) {
        logger.error(`cannot connect to the server`)
        process.exit(1);
    }
})();

app.get('/health', (req, res) => {
    res.send("server is healthy and is running fine");
})
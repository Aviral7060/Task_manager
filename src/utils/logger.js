const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
    level: "info",
    format: combine(timestamp(), logFormat),
    transports: [
        new DailyRotateFile({
            filename: "logs/application-%DATE%.log", // Logs saved in /logs folder
            datePattern: "YYYY-MM-DD", // Creates a new file daily
            maxSize: "20m", // Max log file size (20MB)
            maxFiles: "14d", // Keep logs for 14 days
        }),
        new DailyRotateFile({
            filename: "logs/errors-%DATE%.log",
            level: "error",
            datePattern: "YYYY-MM-DD", // Creates a new file daily
            maxSize: "20m", // Max log file size (20MB)
            maxFiles: "14d", // Keep logs for 14 days
        })
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console())
};

module.exports = logger;
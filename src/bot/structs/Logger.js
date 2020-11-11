const {
    createLogger,
    format,
    transports: { Console }
} = require('winston');

const colors = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    debug: '\x1b[32m'
};

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const logger = createLogger({
    levels: levels,
    format: format.combine(
        format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        format.printf(info => {
            const { timestamp, level, message } = info;
            return `${colors[level]}[${timestamp}][${level.toUpperCase()}]\x1b[0m: ${message}`;
        })
    ),
    transports: [
        new Console({
            level: 'debug',
            handleExceptions: true
        })
    ]
});

module.exports = logger;
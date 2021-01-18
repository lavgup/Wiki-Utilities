/* eslint-disable no-undef */
const config = require('../../config.json');
const WUClient = require('./structs/Client');

const __rootdir__ = __dirname || process.cwd();

const client = new WUClient({
    root: __rootdir__,
    ...config
});

process.on('unhandledRejection', error => client.logger.error('Uncaught Promise Rejection:', error));

client.start().then(() => client.logger.info('Started client!'));
/* eslint-disable no-undef */
const config = require('../../config.json');
const WUClient = require('./structs/Client');

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

const __rootdir__ = __dirname || process.cwd();

const client = new WUClient({
    root: __rootdir__,
    ...config
});

client.start();
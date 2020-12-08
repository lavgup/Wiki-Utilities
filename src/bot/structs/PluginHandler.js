const Plugin = require('../structs/Plugin');
const { AkairoHandler, AkairoError } = require('discord-akairo');

class PluginHandler extends AkairoHandler {
    constructor(client, {
        directory,
        classToHandle = Plugin,
        extensions = ['.js']
    } = {}) {
        if (!(classToHandle.prototype instanceof Plugin || classToHandle === Plugin)) {
            // noinspection JSCheckFunctionSignatures
            throw new AkairoError('INVALID_CLASS_TO_HANDLE', classToHandle.name, Plugin.name);
        }

        super(client, {
            directory,
            classToHandle,
            extensions
        });
    }
}

module.exports = PluginHandler;
const { Listener } = require('discord-akairo');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        });
    }

    // noinspection JSCheckFunctionSignatures
    exec() {
        this.client.logger.info(`Logged in as ${this.client.user.tag}!`);

        // noinspection JSUnresolvedVariable
        this.client.user.setPresence({
            activity: {
                name: `${this.client.config.prefixes[0]}help`,
                type: 'WATCHING'
            }
        }).then(() => {});
    }
}

module.exports = ReadyListener;
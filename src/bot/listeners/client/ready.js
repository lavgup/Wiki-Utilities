const { Listener } = require('discord-akairo');
const { version } = require('../../../../package.json');
const { prefixes, status } = require('../../../../config.json');

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
                name: this.replaceVars(status.content),
                type: status.type.toUpperCase()
            }
        }).then(() => {});
    }

    replaceVars(content) {
        const replacements = {
            '$prefix': prefixes[0],
            '$version': version,
            '$guilds': this.client.guilds.cache.size
        };

        for (const [key, val] of Object.entries(replacements)) {
            if (val) content = content.replace(key, val);
        }

        return content;
    }
}

module.exports = ReadyListener;
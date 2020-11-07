const { Listener } = require('discord-akairo');
const { stripIndents } = require('common-tags');

class MissingPermissionsListener extends Listener {
    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions',
            category: 'commandHandler'
        });
    }

    exec(message, command, type, missing) {
        let result;

        switch (type) {
            case 'client':
                result = stripIndents`
                I am missing the following permission${missing.length > 1 ? 's' : '' } to run this command:
                ${missing
                    .map(m => `\`${m}\``)
                    .join('\n')
                }
                `;
                break;
            case 'user':
                result = stripIndents`
                you are missing the following permission${missing.length > 1 ? 's' : '' } to run this command:
                ${missing
                    .map(m => `\`${m}\``)
                    .join('\n')
                }
                `;
        }

        try {
            return message.util.reply(result);
            // eslint-disable-next-line no-empty
        } catch {}
    }
}

module.exports = MissingPermissionsListener;
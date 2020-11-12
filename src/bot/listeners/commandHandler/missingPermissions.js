const i18n = require('i18next');
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
                ${i18n.t('handler.listeners.missing_permissions.client_missing', { count: missing.length })}
                ${missing
                    .map(m => `\`${m}\``)
                    .join('\n')
                }
                `;
                break;
            case 'user':
                result = stripIndents`
                ${i18n.t('handler.listeners.missing_permissions.user_missing', { count: missing.length })}
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
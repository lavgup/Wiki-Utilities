const i18n = require('i18next');
const { Listener } = require('discord-akairo');

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
                result = this.client.fmt.stripIndents(`
                ${i18n.t('handler.listeners.missing_permissions.client_missing', { count: missing.length })}
                ${missing
                    .map(m => `\`${m}\``)
                    .join('\n')
                }
                `);

                this.client.logger.warn(`Client missing permission(s) for command ${command.id}}: ${missing.join('  ')}`);
                break;
            case 'user':
                result = this.client.fmt.stripIndents(`
                ${i18n.t('handler.listeners.missing_permissions.user_missing', { count: missing.length })}
                ${missing
                    .map(m => `\`${m}\``)
                    .join('\n')
                }
                `);

                this.client.logger.warn(`User ${message.author} missing permission(s) for command ${command.id}}: ${missing.join('  ')}`);
        }

        try {
            return message.util.reply(result);
            // eslint-disable-next-line no-empty
        } catch {}
    }
}

module.exports = MissingPermissionsListener;
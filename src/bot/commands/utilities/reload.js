const i18n = require('i18next');
const { stripIndents } = require('common-tags');
const Command = require('../../structs/Command');
const { Listener, Inhibitor, Argument } = require('discord-akairo');

class ReloadCommand extends Command {
    constructor() {
        super('reload', {
            aliases: ['reload', 'rl'],
            description: i18n.t('commands.reload.description', { returnObjects: true }),
            category: 'utilities',
            ownerOnly: true,
            args: [
                {
                    id: 'module',
                    type: Argument.union(
                        'command',
                        'commandAlias',
                        'listener',
                        'inhibitor'
                    ),
                    prompt: {
                        start: message => i18n.t('commands.reload.prompt.start', { author: `<@${message.author.id}>` }),
                        retry: message => i18n.t('commands.reload.prompt.retry', { author: `<@${message.author.id}>` })
                    }
                }
            ]
        });
    }

    exec(message, { module }) {
        try {
            const reloaded = module.reload();

            let type;
            if (reloaded instanceof Command) {
                type = 'command';
            } else if (reloaded instanceof Listener) {
                type = 'listener';
            } else if (reloaded instanceof Inhibitor) {
                type = 'inhibitor';
            }

            return message.util.send(i18n.t('commands.reload.success', { type: type, id: reloaded.id }));
        } catch (err) {
            return message.util.send(stripIndents`
            ${i18n.t('commands.reload.error')}
            \`\`\`apache
            ${err.message}
            \`\`\`
            `);
        }
    }
}

module.exports = ReloadCommand;
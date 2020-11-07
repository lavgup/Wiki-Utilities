const { stripIndents } = require('common-tags');
const Command = require('../../structs/Command');
const { Listener, Inhibitor, Argument } = require('discord-akairo');

class ReloadCommand extends Command {
    constructor() {
        super('reload', {
            aliases: ['reload', 'rl'],
            description: {
                content: 'Reloads a module.',
                usages: ['[command]'],
                examples: ['blacklist', '']
            },
            category: 'Utilities',
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
                        start: message => `${message.author}, which module do you wish to reload?`,
                        retry: message => `${message.author}, that doesn't look like a valid module!`
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

            return message.util.send(`Successfully reloaded ${type} **${reloaded.id}**.`);
        } catch (err) {
            return message.util.send(stripIndents`
            Something went wrong.
            \`\`\`apache
            ${err.message}
            \`\`\`
            `);
        }
    }
}

module.exports = ReloadCommand;
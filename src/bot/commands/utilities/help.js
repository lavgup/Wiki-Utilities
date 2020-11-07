const Command = require('../../structs/Command');

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'halp', 'h'],
            description: {
                content: 'Sends information on the bot\'s commands.',
                usages: ['', '[command]'],
                examples: ['', 'tag']
            },
            category: 'Utilities',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    id: 'command',
                    type: 'commandAlias'
                }
            ]
        });
    }

    exec(message, { command }) {
        const embed = {
            author: {},
            fields: [],
            color: 'YELLOW'
        };
        const [prefix] = this.handler.prefix;

        if (command) {
            embed.author.name = `${this.client.util.capitalise(command.aliases[0])} Command Help`;
            embed.author.icon_url = this.client.user.displayAvatarURL();
            embed.description = command.description.content || 'No description provided.';

            if (command.aliases && command.aliases.length > 1) {
                embed.fields.push({
                    name: 'Aliases',
                    value: command.aliases.slice(1).join('\n')
                });
            }

            if (command.description.usages && command.description.usages.length) {
                embed.fields.push({
                    name: 'Usages',
                    value: command.description.usages.map(usage => `${prefix}${command.aliases[0]} ${this.formatUsage(usage)}`).join('\n')
                });
            }

            if (command.description.examples && command.description.examples.length) {
                embed.fields.push({
                    name: 'Examples',
                    value: command.description.examples.map(example => `${prefix}${command.aliases[0]} ${example}`).join('\n')
                });
            }
        } else {
            embed.description = `A list of all available commands.\nFor information on a specific command, send \`${prefix}${this.aliases[0]} <command>\``;

            for (const category of this.handler.categories.values()) {
                const commands = category
                    .filter(cmd => cmd.aliases.length > 0 && !cmd.ownerOnly)
                    .map(cmd => `\`${cmd.aliases[0]}\``)
                    .join(' ');
                if (!commands.length) continue;

                embed.fields.push({
                    name: `${category.id}`,
                    value: commands
                });
            }
        }

        return message.util.send({ embed: embed });
    }

    formatUsage(usage) {
        return usage
            .replace(/<[^>]+>/g, '**$&**')
            .replace(/\[[^\]]+]/g, '*$&*');
    }
}

module.exports = HelpCommand;
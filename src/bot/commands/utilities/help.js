const i18n = require('i18next');
const Command = require('../../structs/Command');

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'halp', 'h'],
            description: {
                content: i18n.t('commands.help.description', { returnObjects: true }),
                usages: ['', '[command]']
            },
            category: 'utilities',
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
            embed.author.name = i18n.t('commands.help.command_help', { command: this.client.util.capitalise(command.aliases[0]) });
            embed.author.icon_url = this.client.user.displayAvatarURL();
            embed.description = command.description.content || i18n.t('commands.help.no_description');

            if (command.aliases && command.aliases.length > 1) {
                embed.fields.push({
                    name: i18n.t('commands.help.aliases'),
                    value: command.aliases.slice(1).join('\n')
                });
            }

            if (command.description.usages && command.description.usages.length) {
                embed.fields.push({
                    name: i18n.t('commands.help.usages'),
                    value: command.description.usages.map(usage => `${prefix}${command.aliases[0]} ${this.formatUsage(usage)}`).join('\n')
                });
            }
        } else {
            embed.description = `${i18n.t('commands.help.list')}\n${i18n.t('commands.help.more_info', { prefix: prefix, alias: this.aliases[0] } )}`;

            for (const category of this.handler.categories.values()) {
                const commands = category
                    .filter(cmd => cmd.aliases.length > 0 && !cmd.ownerOnly)
                    .map(cmd => `\`${cmd.aliases[0]}\``)
                    .join(' ');

                if (!commands.length) continue;

                const categories = i18n.t('handler.categories', { returnObjects: true });

                embed.fields.push({
                    name: categories[category.id],
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
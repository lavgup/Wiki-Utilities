const i18n = require('i18next');
const { Inhibitor } = require('discord-akairo');
const { stripIndents } = require('common-tags');

class WikiActionInhibitor extends Inhibitor {
    constructor() {
        super('wikiAction', {
            reason: 'wikiAction'
        });

        this.commandMap = {
            block: { needsRole: true, needsCredentials: true },
            category: { needsRole: false, needsCredentials: false },
            delete: { needsRole: true, needsCredentials: true },
            edit: { needsRole: true, needsCredentials: true },
            move: { needsRole: true, needsCredentials: true },
            protect: { needsRole: true, needsCredentials: true },
            undelete: { needsRole: true, needsCredentials: true }
        };
    }

    async exec(message, command) {
        if (!message.guild) return false;
        if (message.util.parsed.command.categoryID !== 'wiki') return false;

        const config = this.client.config.wiki;
        if (!config) return false;

        const { needsRole, needsCredentials } = this.commandMap[message.util.parsed.command.id];

        if (needsRole === false && needsCredentials === false) return false;

        if (config.blacklisted_users.includes(message.author.id)) return true;

        if (!config.url) {
            await message.util.send(i18n.t('handler.inhibitors.wiki_action.no_wiki'));
            return true;
        }
        if (needsRole) {
            if (!config.allowed_roles.length) {
                await message.util.send(i18n.t('handler.inhibitors.wiki_action.no_wiki'));
                return true;
            }

            const arr = [];
            config.allowed_roles.forEach(role => arr.push(message.guild.roles.cache.get(role)));

            if (!config.allowed_roles.some(role => message.member.roles.cache.has(role))) {
                await message.util.send(stripIndents`
        ${i18n.t('handler.inhibitors.wiki_action.no_wiki')}
        ${arr.map(role => `\`${role.name}\``).join('\n')}
        `);
                return true;
            }
        }

        if (needsCredentials && (!config.credentials || (!config.credentials.username || !config.credentials.password))) {
            await message.util.send(i18n.t('handler.inhibitors.wiki_action.no_wiki'));
            return true;
        }

        return false;
    }
}

module.exports = WikiActionInhibitor;
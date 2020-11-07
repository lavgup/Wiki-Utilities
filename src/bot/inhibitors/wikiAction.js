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
        if (message.util.parsed.command.categoryID !== 'Wiki') return false;

        const config = this.client.config.wiki;
        if (!config) return false;

        const { needsRole, needsCredentials } = this.commandMap[message.util.parsed.command.id];

        if (needsRole === false && needsCredentials === false) return false;

        if (config.blacklisted_users.includes(message.author.id)) return true;

        if (!config.url) {
            await message.util.send(`There isn't a wiki set up for this server, yet!`);
            return true;
        }
        if (needsRole) {
            if (!config.allowed_roles.length) {
                await message.util.send(`This command requires a role to be set and given to users to prevent abuse.`);
                return true;
            }

            const arr = [];
            config.allowed_roles.forEach(role => arr.push(message.guild.roles.cache.get(role)));

            if (!config.allowed_roles.some(role => message.member.roles.cache.has(role))) {
                await message.util.send(stripIndents`
        You need one of the following roles to use this command.
        ${arr.map(role => `\`${role.name}\``).join('\n')}
        `);
                return true;
            }
        }

        if (needsCredentials && (!config.credentials || (!config.credentials.username || !config.credentials.password))) {
            await message.util.send(`I am not logged into a wiki bot!`);
            return true;
        }

        return false;
    }
}

module.exports = WikiActionInhibitor;
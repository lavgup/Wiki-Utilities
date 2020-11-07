const { Listener } = require('discord-akairo');

class MessageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            event: 'messageReactionAdd',
            category: 'client'
        });
    }

    async exec(reaction, user) {
        const config = this.client.config.wiki;

        // If server doesn't have RcGcDw extension enabled
        if (!config.rcgcdw_extension.enabled) return;

        // Fetch resources if partial
        if (reaction.partial) await reaction.fetch();
        if (user.partial) await user.fetch();

        const { message, emoji } = reaction;

        // If reaction wasn't in RcGcDw logging channel
        if (message.channel.id !== config.rcgcdw_extension.channel_id) return;

        const member = await message.guild.members.fetch(user);

        // If user isn't permitted to take administrative actions
        if (!config.allowed_roles.some(role => member.roles.cache.has(role))
            || config.blacklisted_users.includes(user.id)
        ) return;

        const emojis = Object.values(config.rcgcdw_extension.emojis);
        if (!emojis.includes(emoji.name)) return;

        const reason = config.user_map.enabled
            && config.user_map[user.id]
        ? `Action taken through Discord - [[User:${config.user_map[user.id]}|${config.user_map[user.id]}]]`
        : `Action taken through Discord - ${user.tag}`;

        switch (emoji.name) {
            case '\uD83C\uDDE9':
                await this.handleDelete(message, reason);
                break;
            case '\uD83C\uDDF7':
                await this.handleRevert(message, reason);
                break;
            case '\uD83C\uDDE7':
                await this.handleBlock(message, reason);
                break;
        }
    }

    async handleDelete(message, reason) {
        // Hacky method to filter out Discussion/message wall posts
        // will probably get rid of this soon
        if (message.content.includes('\'s Message Wall')
        || message.content.includes('created a [reply]')
        ) return;

        const regex = /(?:created|edited|protected) \[(.[^\]]*)/;

        const matches = regex.exec(message.content);
        if (!matches) return;

        const [, title] = matches;

        try {
            await this.client.bot.login();

            await this.client.bot.delete({
                title: title,
                reason: reason
            });

            return message.react('✅');
        } catch (err) {
            return message.react('❌');
        }
    }

    async handleRevert(message, reason) {
        const titleRegex = /edited \[(.[^\]]*)/;
        const diffRegex = /diff=(.[^&]+)/;

        const titleMatches = titleRegex.exec(message.content);
        if (!titleMatches) return;

        const [, title] = titleMatches;
        const diffMatches = diffRegex.exec(message.content);

        const [, diff] = diffMatches;

        try {
            await this.client.bot.login();

            await this.client.bot.undo({
                title: title,
                revision: diff,
                summary: reason
            });

            return message.react('✅');
        } catch (err) {
            return message.react('❌');
        }
    }

    async handleBlock(message, reason) {
        const regex = /User:(.[^)>]+)/;

        const matches = regex.exec(message.content);
        if (!matches) return;

        const [, user] = matches;
        if (user === 'YouTube Wiki Bot') return message.react('❌');

        try {
            await this.client.bot.login();

            await this.client.bot.block({
                user: user,
                reason: reason,
                expiry: 'never'
            });

            return message.react('✅');
        } catch (err) {
            return message.react('❌');
        }
    }
}

module.exports = MessageReactionAddListener;
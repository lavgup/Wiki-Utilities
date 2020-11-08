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
        this.config = config;

        // If server doesn't have RcGcDw extension enabled
        if (!config.rcgcdw_extension.enabled) return;

        // Fetch resources if partial
        if (reaction.partial) await reaction.fetch();
        if (user.partial) await user.fetch();

        const { message, emoji } = reaction;

        // If reaction wasn't in RcGcDw logging channel
        if (!config.rcgcdw_extension.channel_ids.includes(message.channel.id)) return;

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
        let page;

        if (message.content
            && this.config.rcgcdw_extension.mode === 'compact'
        ) {
            page = this.parseCompactContent(message.content, 1);
        }

        if (message.embeds.length
            && message.embeds[0].author.name !== this.config.rcgcdw_extension.wiki_name
            && this.config.rcgcdw_extension.mode === 'embed'
        ) {
            // Remove stuff like (m +69), (-420) and ((N!) 0)
            page = message.embeds[0].title.replace(/\((?:(?:m|\(N!\)) )?[+-]?\d*\)/, '').trim();
        }

        if (!page) return message.react('❌');

        await message.react('774872461246070795');

        try {
            await this.client.bot.login();

            await this.client.bot.delete({
                title: page,
                reason: reason
            });

            await message.react('✅');
        } catch (err) {
            await message.react('❌');
        } finally {
            await message.reactions.cache.get('774872461246070795').remove();
        }
    }

    async handleRevert(message, reason) {
        let page;

        if (message.content
        && this.config.rcgcdw_extension.mode === 'compact'
        ) {
            page = this.parseCompactContent(message.content, 1);
        }

        if (message.embeds.length
            && message.embeds[0].author.name !== this.config.rcgcdw_extension.wiki_name
            && this.config.rcgcdw_extension.mode === 'embed'
        ) {
            // Remove stuff like (m +69), (-420) and ((N!) 0)
            page = message.embeds[0].title.replace(/\((?:(?:m|\(N!\)) )?[+-]?\d*\)/, '').trim();
            message.content = message.embeds[0].url;
        }

        const diffRegex = /diff=(\d*)/;
        const diffMatches = diffRegex.exec(message.content);

        if (!diffMatches) return message.react('❌');
        const [, diff] = diffMatches;

        await message.react('774872461246070795');

        try {
            await this.client.bot.login();

            await this.client.bot.undo({
                title: page,
                revision: diff,
                summary: reason
            });

            await message.react('✅');
        } catch (err) {
            await message.react('❌');
        } finally {
            await message.reactions.cache.get('774872461246070795').remove();
        }
    }

    async handleBlock(message, reason) {
        let user;

        if (message.content
            && this.config.rcgcdw_extension.mode === 'compact'
        ) {
            user = this.parseCompactContent(message.content, 0);
        }

        if (message.embeds.length
            && message.embeds[0].author.name !== this.config.rcgcdw_extension.wiki_name
            && this.config.rcgcdw_extension.mode === 'embed'
        ) {
            user = message.embeds[0].author.name;
        }

        // Prevent admins trying to block the bot
        // idk why they would, but hey, accidents happen
        if (user === this.config.credentials.username.replace(/@(?:.(?!@))+$/, '')) return message.react('❌');

        await message.react('774872461246070795');

        try {
            await this.client.bot.login();

            await this.client.bot.block({
                user: user,
                reason: reason,
                expiry: this.config.rcgcdw_extension.block_duration
            });

            await message.react('✅');
        } catch (err) {
            await message.react('❌');
        } finally {
            await message.reactions.cache.get('774872461246070795').remove();
        }
    }

    parseCompactContent(content, positionIndex) {
        const maskedLinkRegex = /\[(.[^)>]+)]/g;

        const arr = [];

        for (const match of content.matchAll(maskedLinkRegex)) {
            arr.push(match);
        }

        return arr[positionIndex][1];
    }
}

module.exports = MessageReactionAddListener;
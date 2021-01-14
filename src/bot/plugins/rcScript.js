const i18n = require('i18next');
const Plugin = require('../structs/Plugin');
const {
    getBotInstance,
    isNotAllowed,
    getTypeFromEmoji,
    getReason
} = require('./utils');

class RCScript extends Plugin {
    constructor(options) {
        super('rcscript');
        this.client = options.client;

        this.check = '✅';
        this.cross = '❌';
        this.loading = '⏳';

        this.client.on('messageReactionAdd', this.exec.bind(this));
    }

    async exec(reaction, user) {
        // Fetch reaction if partial
        if (reaction.partial) await reaction.fetch();

        const { message, emoji } = reaction;

        // Message wasn't in a guild
        if (!message.guild) return;

        const config = this.client.config.guilds[message.guild.id];
        this.config = config;

        // If server doesn't have RcGcDw extension enabled
        if (!config.rcgcdw_extension.enabled) return;

        // If reaction wasn't in RcGcDw logging channel
        if (!config.rcgcdw_extension.channel_ids.includes(message.channel.id)) return;

        // Fetch user if partial
        if (user.partial) await user.fetch();

        const member = await message.guild.members.fetch(user);

        // If user isn't permitted to take administrative actions
        const notAllowed = isNotAllowed({
            guildConfig: config,
            config: this.config,
            member,
            user
        });

        if (notAllowed) return;

        const type = getTypeFromEmoji(emoji, config.rcgcdw_extension.emojis);
        if (!type) return;

        const reason = getReason(this.client.config, user);

        this.bot = getBotInstance(message.guild, this.config);

        switch (type) {
            case 'delete':
                await this.handleDelete(message, user, reason);
                break;
            case 'revert':
                await this.handleRevert(message, user, reason);
                break;
            case 'block':
                await this.handleBlock(message, user, reason);
                break;
        }
    }

    async handleDelete(message, user, reason) {
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

        if (!page) return message.react(this.cross);

        try {
            await message.react(this.loading);
            await this.bot.login(this.config.credentials.username, this.config.credentials.password);

            await this.bot.delete({
                title: page,
                reason
            });

            await message.react(this.check);
        } catch (err) {
            await message.react(this.cross);
            user.send(
                i18n.t('plugins.rc_script.error', { error: err.message })
            ).catch(() => {});
        } finally {
            await message.reactions.cache.get(this.loading).remove();
        }
    }

    async handleRevert(message, user, reason) {
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

        if (!diffMatches) return message.react(this.cross);
        const [, diff] = diffMatches;

        await message.react(this.loading);

        try {
            await this.bot.login(this.config.credentials.username, this.config.credentials.password);

            await this.bot.undo({
                title: page,
                revision: diff,
                summary: reason
            });

            await message.react(this.check);
        } catch (err) {
            await message.react(this.cross);
            user.send(
                i18n.t('plugins.rc_script.error', { error: err.message })
            ).catch(() => {});
        } finally {
            await message.reactions.cache.get(this.loading).remove();
        }
    }

    async handleBlock(message, user, reason) {
        let username;

        if (message.content
            && this.config.rcgcdw_extension.mode === 'compact'
        ) {
            username = this.parseCompactContent(message.content, 0);
        }

        if (message.embeds.length
            && message.embeds[0].author.name !== this.config.rcgcdw_extension.wiki_name
            && this.config.rcgcdw_extension.mode === 'embed'
        ) {
            username = message.embeds[0].author.name;
        }

        // Prevent admins trying to block the bot
        // idk why they would, but hey, accidents happen
        if (username === this.config.credentials.username.replace(/@(?:.(?!@))+$/, '')) return message.react('❌');

        await message.react(this.loading);

        try {
            await this.bot.login(this.config.credentials.username, this.config.credentials.password);

            await this.bot.block({
                user: username,
                reason: reason,
                expiry: this.config.rcgcdw_extension.block_duration
            });

            await message.react(this.check);
        } catch (err) {
            await message.react(this.cross);
            user.send(
                i18n.t('plugins.rc_script.error', { error: err.message })
            ).catch(() => {});
        } finally {
            await message.reactions.cache.get(this.loading).remove();
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

module.exports = RCScript;
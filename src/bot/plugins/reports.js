const i18n = require('i18next');
const Plugin = require('../structs/Plugin');
const {
    isNotAllowed,
    getBotInstance,
    getReason,
    getTypeFromEmoji
} = require('./utils');

class ReportsPlugin extends Plugin {
    constructor(options) {
        super('reports');
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

        // If server doesn't have Reports extension enabled
        if (!config.reports.enabled) return;

        // If reaction wasn't in reports channel
        if (config.reports.channel_id !== message.channel.id) return;

        // Fetch user if partial
        if (user.partial) await user.fetch();

        // Fetch member
        const member = await message.guild.members.fetch(user);

        // If user isn't permitted to take administrative actions
        const notAllowed = isNotAllowed({
            guildConfig: config,
            config: this.client.config,
            member,
            user
        });

        if (notAllowed) return;

        const type = getTypeFromEmoji(emoji, config.reports.emojis);
        if (!type) return;

        const reason = getReason(this.client.config, user);

        this.bot = getBotInstance(message.guild, config);

        switch (type) {
            case 'delete':
                await this.handleDelete(message, user, reason);
                break;
            case 'block':
                await this.handleBlock(message, user, reason);
                break;
        }
    }

    async handleDelete(message, user, reason) {
        // eslint-disable-next-line prefer-regex-literals
        const ARTICLE_REGEX = new RegExp(`${this.config.articlePath}([a-zA-Z0-9-~]+)`);

        const matches = message.content.match(ARTICLE_REGEX);
        if (!matches?.length) return message.util.send(i18n.t('plugins.reports.missing', {
            user: user.toString(),
            type: 'page'
        }));

        const [, page] = matches;

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
            await user.send(err.message);
        } finally {
            await message.reactions.cache.get(this.loading)?.remove();
        }
    }

    async handleBlock(message, user, reason) {
        const capitalise = string => string.charAt(0).toUpperCase() + string.slice(1);
        const userTranslated = capitalise(i18n.t('plugins.reports.user'));

        // eslint-disable-next-line prefer-regex-literals
        const USER_REGEX = new RegExp(`${this.config.articlePath}${userTranslated}:([a-zA-Z0-9-~]+)`);

        const matches = message.content.match(USER_REGEX);
        if (!matches?.length) return message.util.send(i18n.t('plugins.reports.missing', {
            user: user.toString(),
            type: 'user'
        }));

        const [, userToBlock] = matches;

        try {
            await message.react(this.loading);
            await this.bot.login(this.config.credentials.username, this.config.credentials.password);

            await this.bot.block({
                user: userToBlock,
                reason,
                expiry: 'infinite',
                allowUserTalk: this.config.defaults.allow_user_talk,
                autoblock: this.config.defaults.autoblock
            });

            await message.react(this.check);
        } catch (err) {
            await message.react(this.cross);
            await user.send(err.message);
        } finally {
            await message.reactions.cache.get(this.loading)?.remove();
        }
    }
}

module.exports = ReportsPlugin;
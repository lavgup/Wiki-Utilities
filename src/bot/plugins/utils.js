const i18n = require('i18next');
const { MediaWikiJS } = require('@lavgup/mediawiki.js');
const instances = {};

module.exports.getBotInstance = (guild, config) => {
    if (!instances[guild.id]) {
        instances[guild.id] = new MediaWikiJS({
            url: config.url,
            botUsername: config.credentials.username,
            botPassword: config.credentials.password
        });
    }

    return instances[guild.id];
};

module.exports.isNotAllowed =
    ({
         guildConfig,
         config,
         member,
         user
     }) => {
        if (
            (
                !guildConfig.allowed_roles.some(role => member.roles.cache.has(role))
                && !config.owners.includes(user.id)
            )
            || guildConfig.blacklisted_users.includes(user.id)
        ) return true;
    };

module.exports.getTypeFromEmoji = (emoji, emojis) => {
    let type;
    for (const [key, value] of Object.entries(emojis)) {
        if (!Array.isArray(value)) continue;

        if (value.some(t => t.includes(emoji.name))) {
            type = key;
        }
    }

    return type;
};

module.exports.getReason = (config, user) => {
    return (
        config.user_map.enabled
        && config.user_map[user.id]
            ? i18n.t('plugins.rc_script.summary', {
                user: `[[User:${config.user_map[user.id]}|${config.user_map[user.id]}]]`
            })
            : i18n.t('plugins.rc_script.summary', {
                user: user.tag
            })
    );
};
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

        if (reaction.partial) await reaction.fetch();

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

        // TODO: this part
        switch (emoji.name) {
            case '\uD83C\uDDE9':
                 // delete page
                break;
            case '\uD83C\uDDF7':
                // revert edit
                break;
            case '\uD83C\uDDE7':
                // block user
                break;
        }
    }
}

module.exports = MessageReactionAddListener;
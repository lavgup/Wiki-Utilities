const i18n = require('i18next');
const { Inhibitor } = require('discord-akairo');

class PostCommandInhibitor extends Inhibitor {
    constructor() {
        super('postCommand', {
            reason: 'postCommand'
        });
    }

    async exec(message, command) {
        if (command.id !== 'post') return false;

        if (!this.client.config.wiki.url.includes('fandom.com')
            || !this.client.config.wiki.url.includes('wikia.org')) {
            await message.util.send(i18n.t('handler.inhibitors.post_command.not_fandom'));
            return true;
        }

        return false;
    }
}

module.exports = PostCommandInhibitor;
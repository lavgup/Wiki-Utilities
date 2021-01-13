const i18n = require('i18next');
const Action = require('./Action');

class WhoAmIAction extends Action {
    constructor(data) {
        super(data);
        this.IP_ADDRESS_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    }

    async exec() {
        const initMessage = await this.message.util.send(i18n.t('commands.whoami.loading'));

        await this.bot.login();
        const info = await this.bot.whoAmI();

        if (this.IP_ADDRESS_REGEX.test(info.name)) return initMessage.edit(i18n.t('commands.whoami.not_logged_in'));

        let usergroup = 'user';

        if (info.groups.includes('sysop')) usergroup = 'administrator';
        else if (info.groups.includes('content-moderator')) usergroup = 'content moderator';
        else if (info.groups.includes('autoconfirmed')) usergroup = 'autoconfirmed user';

        const isVowel = usergroup === 'administrator'
            || 'autoconfirmed';

        return initMessage.edit(i18n.t('commands.whoami.logged_in', {
            context: isVowel && 'vowel',
            user: info.name,
            editcount: info.editcount,
            usergroup
        }));
    }
}

module.exports = WhoAmIAction;
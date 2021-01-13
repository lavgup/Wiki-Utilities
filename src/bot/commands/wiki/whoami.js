const i18n = require('i18next');
const Command = require('../../structs/Command');
const WhoAmIAction = require('./actions/WhoAmI');

class WhoAmI extends Command {
    constructor() {
        super('whoami', {
            aliases: ['whoami', 'me'],
            description: i18n.t('commands.whoami.description', { returnObjects: true }),
            category: 'wiki',
            channel: 'guild'
        });
    }

    exec(message) {
        return new WhoAmIAction({
            message
        }).commit();
    }
}

module.exports = WhoAmI;
const i18n = require('i18next');
const Command = require('../../structs/Command');
const UndeleteAction = require('./actions/Undelete');

class UndeleteCommand extends Command {
    constructor() {
        super('undelete', {
            aliases: ['undelete', 'restore', 'undel'],
            description: i18n.t('commands.undelete.description', { returnObjects: true }),
            category: 'wiki',
            channel: 'guild',
            args: [
                {
                    id: 'page',
                    type: 'string',
                    match: 'text',
                    prompt: {
                        start: message => i18n.t('commands.undelete.prompt', { author: `<@${message.author.id}>` })
                    }
                },
                {
                    id: 'reason',
                    type: 'summary',
                    match: 'option',
                    flag: ['--reason=', '-r='],
                    default: i18n.t('general.no_reason')
                }
            ]
        });
    }

    exec(message, args) {
        return new UndeleteAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = UndeleteCommand;
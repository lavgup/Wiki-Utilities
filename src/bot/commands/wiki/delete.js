const i18n = require('i18next');
const DeleteAction = require('./actions/Delete');
const Command = require('../../structs/Command');

class DeleteCommand extends Command {
    constructor() {
        super('delete', {
            aliases: ['delete', 'del', 'delet'],
            description: i18n.t('commands.delete.description', { returnObjects: true }),
            category: 'wiki',
            channel: 'guild',
            args: [
                {
                    id: 'page',
                    type: 'string',
                    match: 'text',
                    prompt: {
                        start: message => i18n.t('commands.delete.prompt', { author: message.author.toString() })
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
        return new DeleteAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = DeleteCommand;
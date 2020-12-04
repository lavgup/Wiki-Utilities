const i18n = require('i18next');
const MoveAction = require('./actions/Move');
const Command = require('../../structs/Command');

class MoveCommand extends Command {
    constructor() {
        super('move', {
            aliases: ['move', 'rename'],
            description: i18n.t('commands.move.description', { returnObjects: true }),
            channel: 'guild',
            optionFlags: ['--reason', '-r'],
            category: 'wiki',
            args: [
                {
                    id: 'old',
                    type: 'string',
                    prompt: {
                        start: message => i18n.t('commands.move.prompt.old', { author: message.author.toString() })
                    }
                },
                {
                    id: 'new',
                    type: 'string',
                    prompt: {
                        start: message => i18n.t('commands.move.prompt.new', { author: message.author.toString() })
                    }
                },
                {
                    id: 'reason',
                    type: 'summary',
                    match: 'option',
                    flag: ['--reason=', '-r=']
                }
            ]
        });
    }

    exec(message, args) {
        return new MoveAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = MoveCommand;
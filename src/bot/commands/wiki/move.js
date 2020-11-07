const MoveAction = require('./actions/Move');
const Command = require('../../structs/Command');

class MoveCommand extends Command {
    constructor() {
        super('move', {
            aliases: ['move', 'rename'],
            description: {
                content: 'Moves (renames) a page on the set wiki.',
                usages: ['<old_page> <new_page> [-r=reason]'],
                examples: ['"Jake Paul" trash -r="name says it"']
            },
            channel: 'guild',
            optionFlags: ['--reason', '-r'],
            category: 'Wiki',
            args: [
                {
                    id: 'old',
                    type: 'string',
                    prompt: {
                        start: message => `${message.author}, which page shall I move?`
                    }
                },
                {
                    id: 'new',
                    type: 'string',
                    prompt: {
                        start: message => `${message.author}, what shall the page's new name be?`
                    }
                },
                {
                    id: 'reason',
                    type: 'summary',
                    match: 'option',
                    flag: ['--reason=', '-r='],
                    default: 'No reason provided'
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
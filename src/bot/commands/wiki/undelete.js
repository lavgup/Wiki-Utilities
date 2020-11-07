const Command = require('../../structs/Command');
const UndeleteAction = require('./actions/Undelete');

class UndeleteCommand extends Command {
    constructor() {
        super('undelete', {
            aliases: ['undelete', 'restore', 'undel'],
            description: {
                content: 'Restores/undeletes a given page on the set wiki.',
                usages: ['<page> <reason>'],
                examples: ['KSI -r="all sorted out"', 'Sidemen Gaming -r=accidental']
            },
            category: 'Wiki',
            channel: 'guild',
            optionFlags: ['--reason', '-r'],
            args: [
                {
                    id: 'page',
                    type: 'string',
                    match: 'text',
                    prompt: {
                        start: message => `${message.author}, which page shall I unprotect?`
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
        return new UndeleteAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = UndeleteCommand;
const DeleteAction = require('./actions/Delete');
const Command = require('../../structs/Command');

class DeleteCommand extends Command {
    constructor() {
        super('delete', {
            aliases: ['delete', 'del', 'delet'],
            description: {
              content: 'Deletes a given page on the set wiki, with an optional reason for deletion.',
              usages: ['<page> [reason]'],
              examples: ['Project:Rules -r=haha', 'User:Spam Account -r="spamming on pages"']
            },
            category: 'Wiki',
            channel: 'guild',
            args: [
                {
                    id: 'page',
                    type: 'string',
                    match: 'text',
                    prompt: {
                        start: message => `${message.author}, which page do you wish to delete?`
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
        return new DeleteAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = DeleteCommand;
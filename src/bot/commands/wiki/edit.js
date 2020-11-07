const EditAction = require('./actions/Edit');
const Command = require('../../structs/Command');

class EditCommand extends Command {
    constructor() {
        super('edit', {
            aliases: ['edit'],
            description: {
                content: 'Edits a given page on the set wiki, with the option of either appending or prepending content.',
                usages: ['<page> <content> --prepend', '<page> <content> --append'],
                examples: ['PewDiePie {{Stub}} --prepend', '"Sidemen Gaming" [[Category:YouTubers]] --append']
            },
            category: 'Wiki',
            channel: 'guild',
            optionFlags: ['--summary=', '-s=', '--pos=', '-pos=', '-p=']
        });
    }

    *args() {
        const page = yield {
            type: 'string',
            prompt: {
                start: message => `${message.author}, which page do you wish to edit?`
            }
        };

        const content = yield {
            type: 'string',
            prompt: {
                start: message => `${message.author}, what do you wish to add to ${page}?`
            }
        };

        const summary = yield {
            match: 'option',
            type: 'summary',
            flag: ['--summary=', '-s='],
            default: 'No summary provided'
        };

        const pos = yield {
            type: [
                ['prepend', 'p'],
                ['append', 'a']
            ],
            match: 'option',
            flag: ['--pos=', '-pos=', '-p='],
            prompt: {
                start: message => `${message.author}, do you wish to \`prepend\` or \`append\` this content to ${page}?`,
                retry: message => `${message.author}, do you wish to \`prepend\` or \`append\` this content to ${page}?`
            }
        };

        return { page, content, summary, pos };
    }

    exec(message, args) {
        return new EditAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = EditCommand;
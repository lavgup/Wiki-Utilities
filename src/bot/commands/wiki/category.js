const Command = require('../../structs/Command');
const CategoryAction = require('./actions/Category');

class CategoryCommand extends Command {
    constructor() {
        super('category', {
            aliases: ['category', 'cat'],
            description: {
                content: 'Lists all pages in a given category on the set wiki.',
                usages: ['<category>', '--cfd', '--stub'],
                examples: ['Stubs', '--cfd', '--stub']
            },
            category: 'Wiki',
            channel: 'guild',
            flags: ['--cfd', '--cands', '--stub', '--stubs', '-s']
        });
    }

    *args() {
        const cfd = yield {
            id: 'cfd',
            match: 'flag',
            flag: ['--cfd', '-c']
        };

        const stub = yield {
            id: 'stub',
            match: 'flag',
            flag: ['--stub', '--stubs', '-s']
        };

        let category;

        if (!cfd && !stub) {
            category = yield {
                type: 'string',
                match: 'text',
                prompt: {
                    start: message => `${message.author}, which category shall I list the pages of?`
                }
            };
        }

        if (cfd) category = 'Candidates for deletion';
        if (stub) category = 'Stubs';

        return { category };
    }

    exec(message, args) {
        return new CategoryAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = CategoryCommand;
const i18n = require('i18next');
const Command = require('../../structs/Command');
const CategoryAction = require('./actions/Category');

class CategoryCommand extends Command {
    constructor() {
        super('category', {
            aliases: ['category', 'cat'],
            description: i18n.t('commands.category.description', { returnObjects: true }),
            category: 'wiki',
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
                    start: message => i18n.t('commands.category.prompt', { author: message.author.toString() })
                }
            };
        }

        if (cfd) category = this.client.config.wiki.categories.cfd;
        if (stub) category = this.client.config.wiki.categories.stub;

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
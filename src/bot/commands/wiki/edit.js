const i18n = require('i18next');
const EditAction = require('./actions/Edit');
const Command = require('../../structs/Command');

class EditCommand extends Command {
    constructor() {
        super('edit', {
            aliases: ['edit'],
            description: i18n.t('commands.edit.description', { returnObjects: true }),
            category: 'wiki',
            channel: 'guild',
            optionFlags: ['--summary=', '-s=', '--reason=', '-r=', '--pos=', '-pos=', '-p=']
        });
    }

    *args() {
        const page = yield {
            type: 'string',
            prompt: {
                start: message => i18n.t('commands.edit.prompt.page', { author: message.author.toString() })
            }
        };

        const content = yield {
            type: 'string',
            prompt: {
                start: message => i18n.t('commands.edit.prompt.content', { author: message.author.toString() })
            }
        };

        const summary = yield {
            type: 'summary',
            match: 'option',
            flag: ['--summary=', '-s=', '--reason=', '-s=']
        };

        const pos = yield {
            type: [
                ['prepend', 'p'],
                ['append', 'a']
            ],
            match: 'option',
            flag: ['--pos=', '-pos=', '-p='],
            prompt: {
                start: message => i18n.t('commands.edit.prompt.position', { author: message.author.toString() }),
                retry: message => i18n.t('commands.edit.prompt.position', { author: message.author.toString() })
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
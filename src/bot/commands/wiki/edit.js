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
            optionFlags: ['--summary=', '-s=', '--pos=', '-pos=', '-p=']
        });
    }

    *args() {
        const page = yield {
            type: 'string',
            prompt: {
                start: message => i18n.t('commands.edit.prompt.page', { author: `<@${message.author.id}>` })
            }
        };

        const content = yield {
            type: 'string',
            prompt: {
                start: message => i18n.t('commands.edit.prompt.content', { author: `<@${message.author.id}>` })
            }
        };

        const summary = yield {
            match: 'option',
            type: 'summary',
            flag: ['--summary=', '-s='],
            default: i18n.t('general.no_summary')
        };

        const pos = yield {
            type: [
                ['prepend', 'p'],
                ['append', 'a']
            ],
            match: 'option',
            flag: ['--pos=', '-pos=', '-p='],
            prompt: {
                start: message => i18n.t('commands.edit.prompt.position', { author: `<@${message.author.id}>` }),
                retry: message => i18n.t('commands.edit.prompt.position', { author: `<@${message.author.id}>` })
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
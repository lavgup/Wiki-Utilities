const i18n = require('i18next');
const BlockAction = require('./actions/Block');
const Command = require('../../structs/Command');

class BlockCommand extends Command {
    constructor() {
        super('block', {
            aliases: ['block', 'ban'],
            description: i18n.t('commands.block.description', { returnObjects: true }),
            category: 'wiki',
            channel: 'guild',
            flags: ['--unblock', '-ub', '-u'],
            optionFlags: ['--reason=', '-r=']
        });
    }

    *args() {
        const user = yield {
            type: 'string',
            prompt: {
                start: message => i18n.t('commands.block.prompt.user', { author: message.author.toString() })
            }
        };

        const unblock = yield {
            match: 'flag',
            flag: ['--unblock', '-ub', '-u']
        };

        const expiry = unblock
            ? undefined
            : yield {
                type: 'duration',
                prompt: {
                    start: message => i18n.t('commands.block.prompt.expiry.start', { author: message.author.toString() }),
                    retry: message => i18n.t('commands.block.prompt.expiry.retry', { author: message.author.toString() })
                },
                default: 'infinite'
            };

        const reason = yield {
            type: 'summary',
            match: 'option',
            flag: ['--reason=', '-r='],
            default: i18n.t('general.no_reason')
        };

        return { user, unblock, expiry, reason };
    }

    exec(message, args) {
        return new BlockAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = BlockCommand;
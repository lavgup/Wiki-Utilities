const BlockAction = require('./actions/Block');
const Command = require('../../structs/Command');

class BlockCommand extends Command {
    constructor() {
        super('block', {
            aliases: ['block', 'ban'],
            description: {
                content: 'Blocks a given user on wiki.',
                usages: ['<user> <expiry>', '<user> <expiry> <reason>'],
                examples: ['Sidemen19 "1 hour"', 'Sidemen19 never vandalism']
            },
            category: 'Wiki',
            channel: 'guild',
            flags: ['--unblock', '-ub', '-u'],
            optionFlags: ['--reason=', '-r=']
        });
    }

    *args() {
        const user = yield {
            type: 'string',
            prompt: {
                start: message => `${message.author}, which user do you wish to block?`
            }
        };

        const unblock = yield {
            match: 'flag',
            flag: ['--unblock', '-ub', '-u']
        };

        const expiry = unblock
            ? false
            : yield {
                type: 'duration',
                prompt: {
                    start: message => `${message.author}, for how long shall I block this user for?`,
                    retry: message => `${message.author}, that doesn't look like a valid time!`
                }
            };

        const reason = yield {
            type: 'summary',
            match: 'option',
            flag: ['--reason=', '-r='],
            default: 'No reason provided'
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
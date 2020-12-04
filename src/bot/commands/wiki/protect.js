const i18n = require('i18next');
const Command = require('../../structs/Command');
const ProtectAction = require('./actions/Protect');

class ProtectCommand extends Command {
    constructor() {
        super('protect', {
            aliases: ['protect', 'prt'],
            description: i18n.t('commands.protect.description', { returnObjects: true }),
            category: 'wiki',
            channel: 'guild',
            args: [
                {
                    id: 'page',
                    type: 'string',
                    prompt: {
                        start: message => i18n.t('commands.protect.prompt.page', { author: message.author.toString() })
                    }
                },
                {
                    id: 'expiry',
                    type: 'duration',
                    prompt: {
                        start: message => i18n.t('commands.protect.prompt.expiry.start', { author: message.author.toString() }),
                        retry: message => i18n.t('commands.protect.prompt.expiry.retry', { author: message.author.toString() })
                    }
                },
                {
                    id: 'usergroup',
                    type: [['sysop', 's'], ['autoconfirmed', 'ac', 'a']],
                    match: 'option',
                    flag: ['--group=', '-g='],
                    prompt: {
                        start: message => this.client.fmt.stripIndents(`
                        ${i18n.t('commands.protect.prompt.usergroup.start', { author: `<@${message.author.id}` })}
                        
                        ${i18n.t('commands.protect.prompt.usergroup.sysop')}
                        ${i18n.t('commands.protect.prompt.usergroup.autoconfirmed')}
                        `),
                        retry: message => this.client.fmt.stripIndents(`
                        ${i18n.t('commands.protect.prompt.usergroup.retry', { author: `<@${message.author.id}` })}
                        
                        ${i18n.t('commands.protect.prompt.usergroup.sysop')}
                        ${i18n.t('commands.protect.prompt.usergroup.autoconfirmed')}
                        `)
                    }
                },
                {
                    id: 'reason',
                    match: 'option',
                    flag: ['--reason=', '-r=']
                }
            ]
        });
    }

    exec(message, args) {
        return new ProtectAction({
            message: message,
            args: args
        }).commit();
    }
}

module.exports = ProtectCommand;
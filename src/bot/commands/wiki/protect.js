const { stripIndents } = require('common-tags');
const Command = require('../../structs/Command');
const ProtectAction = require('./actions/Protect');

class ProtectCommand extends Command {
    constructor() {
        super('protect', {
            aliases: ['protect', 'prt'],
            description: {
                content: 'Protects a given page on the wiki with an optional expiry.',
                usages: ['<page> <time> [-r=<reason>]'],
                examples: ['KSI 2w -r="High traffic"', 'Project:Rules infinite']
            },
            category: 'Wiki',
            channel: 'guild',
            args: [
                {
                    id: 'page',
                    type: 'string',
                    prompt: {
                        start: message => `${message.author}, which page shall I protect?`
                    }
                },
                {
                    id: 'expiry',
                    type: 'duration',
                    prompt: {
                        start: message => `${message.author}, for how long shall this page be protected for?`,
                        retry: message => `${message.author}, that doesn't look like a valid time!`
                    }
                },
                {
                    id: 'usergroup',
                    type: [['sysop', 's'], ['autoconfirmed', 'ac', 'a']],
                    match: 'option',
                    flag: ['--group=', '-g='],
                    prompt: {
                        start: message => stripIndents`
                        ${message.author}, which usergroup shall be allowed to edit this page?
                        
                        \`sysop\` for only admins, or
                        \`autoconfirmed\` for only autoconfirmed users.
                        `,
                        retry: message => stripIndents`
                        ${message.author}, that doesn't look like a valid usergroup!
                        
                        \`sysop\` for only admins, or
                        \`autoconfirmed\` for only autoconfirmed users.
                        `
                    }
                },
                {
                    id: 'reason',
                    match: 'option',
                    flag: ['--reason=', '-r='],
                    default: 'No reason provided'
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
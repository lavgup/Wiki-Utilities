const { post } = require('got');
const i18n = require('i18next');
const { exec } = require('child_process');
const Command = require('../../structs/Command');

class SSHCommand extends Command {
    constructor() {
        super('ssh', {
            aliases: ['ssh', 'exec', 'execute'],
            description: i18n.t('commands.ssh.description', { returnObjects: true }),
            ownerOnly: true,
            category: 'owner',
            args: [
                {
                    id: 'command',
                    type: 'string',
                    match: 'content',
                    prompt: {
                        start: message => i18n.t('commands.ssh.prompt', { author: message.author.toString() })
                    }
                }
            ]
        });
    }

    exec(message, { command }) {
        exec(command, async (e, out, err) => {
           const result = e ? err: out;

           if (result?.length > 1950) {
               const key = await this.createHaste(result);
               return message.channel.send(i18n.t('commands.ssh.long', { link: `<https://hasteb.in/${key}.js>` }));
           }

           return message.channel.send(`\`\`\`\n${result}\n\`\`\``);
        });
    }

    async createHaste(content) {
        const { body: { key } } = await post('https://hasteb.in/documents', {
            body: content,
            headers: { 'Content-Type': 'application/json' },
            responseType: 'json'
        });

        return key;
    }
}

module.exports = SSHCommand;
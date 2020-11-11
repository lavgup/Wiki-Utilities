const i18n = require('i18next');
const Command = require('../../structs/Command');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            description: {
                content: i18n.t('commands.ping.description')
            },
            category: 'utilities'
        });
    }

    async exec(message, args) {
        const ping = await message.util.send(`:heartbeat: ${this.client.ws.ping}`);
        const RTT = (ping.editedAt || ping.createdAt) - (message.editedAt || message.createdAt);
        await ping.edit(`${ping}ms\n:stopwatch: ${RTT}ms`);
    }
}

module.exports = PingCommand;
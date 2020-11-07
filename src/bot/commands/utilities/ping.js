const Command = require('../../structs/Command');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            description: {
                content: 'Gets the ping of the bot.'
            },
            category: 'Utilities'
        });
    }

    async exec(message, args) {
        const ping = await message.util.send(`:heartbeat: ${this.client.ws.ping}`);
        const RTT = (ping.editedAt || ping.createdAt) - (message.editedAt || message.createdAt);
        await ping.edit(`${ping}ms\n:stopwatch: ${RTT}ms`);
    }
}

module.exports = PingCommand;
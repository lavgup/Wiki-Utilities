const { Listener } = require('discord-akairo');

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked',
            category: 'commandHandler'
        });
    }

    exec(message, command, reason) {
        this.client.logger.info(`Command ${command.id} blocked in ${message.guild ? `${message.guild.name} (${message.guild.id})` : 'DMs'} with reason: ${reason}.`);
    }
}

module.exports = CommandBlockedListener;
const { Listener } = require('discord-akairo');

class CommandStartedListener extends Listener {
    constructor() {
        super('commandStarted', {
            emitter: 'commandHandler',
            event: 'commandStarted',
            category: 'commandHandler'
        });
    }

    exec(message, command, args) {
        this.client.logger.info(`Command ${command.id} started by ${message.author.tag} (${message.author.id}) ${Object.keys(args).length && !args.command ? `with args: ${JSON.stringify(args)}` : '' }`);
    }
}

module.exports = CommandStartedListener;
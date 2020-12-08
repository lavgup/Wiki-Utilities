const { AkairoModule } = require('discord-akairo');

class Plugin extends AkairoModule {
    constructor(id, client) {
        super(id);
        this.client = client;
    }
}

module.exports = Plugin;
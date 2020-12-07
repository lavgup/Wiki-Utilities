const MediaWikiJS = require('@sidemen19/mediawiki.js');

class Action {
    constructor(data) {
        this.message = data.message;
        this.client = this.message.client;

        this.creds = data.message.client.config.guilds[this.message.guild.id].credentials;

        this.config = this.client.config.guilds[this.message.guild.id];
        if (!this.config) throw new Error(`Missing config for guild ${this.message.guild.name} (ID: ${this.message.guild.id})`);

        this.bot = new MediaWikiJS({
            server: this.config.url,
            path: this.config.path || '',
            botUsername: this.config.credentials.username,
            botPassword: this.config.credentials.password
        });
    }

    async commit() {
        try {
            await this.exec();
        } catch (err) {
            return this.message.util.send(err.message);
        }
    }

    exec() {
        this.client.logger.error('exec() not implemented');
    }
}

module.exports = Action;
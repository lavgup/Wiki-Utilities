const { MediaWikiJS } = require('@lavgup/mediawiki.js');

class Action {
    constructor(data) {
        this.message = data.message;
        this.client = this.message.client;

        this.config = this.client.config.guilds[this.message.guild.id];
        if (!this.config) throw new Error(`Missing config for guild ${this.message.guild.name} (ID: ${this.message.guild.id})`);

        this.creds = this.config.credentials;
        this.bot = new MediaWikiJS({
            url: this.config.url,
            botUsername: this.creds.username,
            botPassword: this.creds.password
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
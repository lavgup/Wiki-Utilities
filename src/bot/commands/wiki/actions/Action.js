const MediaWikiJS = require('@sidemen19/mediawiki.js');

class Action {
    constructor(data) {
        this.message = data.message;
        this.config = this.message.client.config.wiki;
    }

    async commit() {
        try {
            this.initBot();
            await this.exec();
        } catch (err) {
            return this.message.util.send(err.message);
        }
    }

    initBot() {
        return this.bot = new MediaWikiJS({
            server: this.config.url,
            path: '',
            botUsername: this.config.credentials.username,
            botPassword: this.config.credentials.password
        });
    }

    exec() {
        console.error('exec() not implemented');
    }
}

module.exports = Action;
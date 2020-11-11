class Action {
    constructor(data) {
        this.message = data.message;
        this.client = this.message.client;

        this.config = this.client.config.wiki;
        this.bot = this.client.bot;
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
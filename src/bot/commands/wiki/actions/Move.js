const Action = require('./Action');

class MoveAction extends Action {
    constructor(data) {
        super(data);

        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const initMessage = await this.message.channel.send('Moving page...');

        try {
            this.bot.move({
                from: this.args.old,
                to: this.args.new,
                reason: this.args.reason
            });
        } catch (err) {
            return initMessage.edit(err.message);
        }

        return initMessage.edit('Successfully moved page!');
    }
}

module.exports = MoveAction;
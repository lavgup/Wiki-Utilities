const Action = require('./Action');

class UndeleteAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;

        this.args = data.args;
    }

    async exec() {
        const initMessage = await this.message.channel.send('Restoring page...');

        try {
            await this.bot.login();

            await this.bot.restore({
                title: this.args.page,
                reason: this.args.reason
            });
        } catch (err) {
            return initMessage.edit(err.message);
        }

        return initMessage.edit('Successfully restored page!');
    }
}

module.exports = UndeleteAction;
const Action = require('./Action');

class DeleteAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;

        this.args = data.args;
    }

    async exec() {
        const initMessage = await this.message.util.send('Deleting page...');

        try {
            await this.bot.login();

            await this.bot.delete({
                title: this.args.page,
                reason: this.args.reason
            });
        } catch (err) {
            return initMessage.edit(err.message);
        }

        return initMessage.edit('Successfully deleted page!');
    }
}

module.exports = DeleteAction;
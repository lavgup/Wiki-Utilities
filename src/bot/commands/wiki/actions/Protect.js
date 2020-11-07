const Action = require('./Action');

class ProtectAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const initMessage = await this.message.util.send('Protecting page...');

        try {
            await this.bot.login();

            await this.bot.protect({
                title: this.args.page,
                expiry: this.args.expiry,
                protections: {
                    edit: this.args.usergroup
                },
                reason: this.args.reason
            });
        } catch (err) {
            return initMessage.edit(err.message);
        }

        return initMessage.edit('Successfully protected page!');
    }
}

module.exports = ProtectAction;
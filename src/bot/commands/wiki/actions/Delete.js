const i18n = require('i18next');
const Action = require('./Action');

class DeleteAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const initMessage = await this.message.util.send(i18n.t('commands.delete.deleting'));

        try {
            await this.bot.login(this.creds.username, this.creds.password);

            await this.bot.delete({
                title: this.args.page,
                reason: this.args.reason
            });
        } catch (err) {
            return initMessage.edit(err.message);
        }

        return initMessage.edit(i18n.t('commands.delete.success'));
    }
}

module.exports = DeleteAction;
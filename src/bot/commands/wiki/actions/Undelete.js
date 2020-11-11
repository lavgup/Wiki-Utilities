const i18n = require('i18next');
const Action = require('./Action');

class UndeleteAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const initMessage = await this.message.channel.send(i18n.t('commands.undelete.restoring'));

        try {
            await this.bot.login();

            await this.bot.restore({
                title: this.args.page,
                reason: this.args.reason
            });
        } catch (err) {
            return initMessage.edit(err.message);
        }

        return initMessage.edit(i18n.t('commands.undelete.success'));
    }
}

module.exports = UndeleteAction;
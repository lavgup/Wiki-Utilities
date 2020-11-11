const i18n = require('i18next');
const Action = require('./Action');

class MoveAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const initMessage = await this.message.channel.send(i18n.t('commands.move.moving'));

        try {
            await this.bot.move({
                from: this.args.old,
                to: this.args.new,
                reason: this.args.reason
            });
        } catch (err) {
            return initMessage.edit(err.message);
        }

        return initMessage.edit(i18n.t('commands.move.success'));
    }
}

module.exports = MoveAction;
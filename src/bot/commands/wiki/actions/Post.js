const i18n = require('i18next');
const Action = require('./Action');

class PostAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const initMessage = await this.message.util.send(i18n.t('commands.post.posting'));

        try {
            await this.bot.post({
                title: this.args.title,
                content: this.args.content
            });

            return initMessage.edit(i18n.t('commands.post.success'));
        } catch (err) {
            return initMessage.edit(err.message);
        }
    }
}

module.exports = PostAction;
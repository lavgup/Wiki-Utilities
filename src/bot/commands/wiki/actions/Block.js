const i18n = require('i18next');
const Action = require('./Action');

class BlockAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.client = data.message.client;
        this.args = data.args;
    }

    async exec() {
        let type;

        if (this.args.glock) type = i18n.t('commands.block.locking');
        else if (this.args.unblock) type = i18n.t('commands.block.unblocking');
        else type = i18n.t('commands.block.blocking');

        const initMessage = await this.message.util.send(type);

        await this.bot.login(this.creds.username, this.creds.password);

        const body = await this.bot.block({
            user: this.args.user,
            expiry: this.args.expiry,
            reason: this.args.reason,
            allowUserTalk: this.config.defaults.allow_user_talk,
            autoblock: this.config.defaults.autoblock,
            reblock: this.config.defaults.reblock
        });

        if (body.error) {
            if (body.error.includes('alreadyblocked')) {
                if (this.args.unblock) {
                    await this.bot.unblock({
                        user: this.args.user,
                        reason: this.args.reason
                    });

                    await initMessage.edit(i18n.t('commands.block.unblock_success'));
                } else initMessage.edit(i18n.t('commands.block.already_blocked'));
            } else if (this.args.unblock) {
                await initMessage.edit(i18n.t('commands.block.not_blocked'));
            } else {
                initMessage.edit(this.client.fmt.stripIndents(`
            ${i18n.t('commands.block.error', { type: type.toLowerCase() })}
            \`\`\`apache
            ${body.error.code}
            
            ${body.error.info}
            \`\`\`
            `));
            }
        } else {
            await this.message.util.send(i18n.t('commands.block.block_success'));
        }

        return this.bot.logout();
    }
}

module.exports = BlockAction;
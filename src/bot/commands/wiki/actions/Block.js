const i18n = require('i18next');
const Action = require('./Action');

class BlockAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const type = this.args.unblock ? 'Unblocking' : 'Blocking';
        const blocking = i18n.t('commands.block.blocking', { type: type });
        const initMessage = await this.message.util.send(blocking);

        await this.bot.login();

        const body = await this.bot.block({
            user: this.args.user,
            expiry: this.args.expiry,
            reason: this.args.reason,
            autoblock: true
        });

        if (body.error) {
            if (body.error.includes('alreadyblocked')) {
                if (this.args.unblock) {
                    await this.bot.unblock({
                        user: this.args.user,
                        reason: this.args.reason
                    });
                    return initMessage.edit(i18n.t('commands.block.unblock_success'));
                }

                return initMessage.edit(i18n.t('commands.block.already_blocked'));
            } else if (this.args.unblock) {
                return initMessage.edit(i18n.t('commands.block.not_blocked'));
            }

            return initMessage.edit(this.client.fmt.stripIndents(`
            ${i18n.t('commands.block.error', { type: type })}
            \`\`\`apache
            ${body.error.code}
            
            ${body.error.info}
            \`\`\`
            `));
        }

        return this.message.util.send(i18n.t('commands.block.block_success'));
    }
 }

module.exports = BlockAction;
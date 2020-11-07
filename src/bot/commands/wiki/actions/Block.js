const Action = require('./Action');
const { stripIndents } = require('common-tags');

class BlockAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const type = this.args.unblock ? 'Unblocking' : 'Blocking';
        const initMessage = await this.message.util.send(`${type} user...`);

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
                    return initMessage.edit('Successfully unblocked user.');
                }

                return initMessage.edit('That user is already blocked! To unblock them, you can pass the `--unblock` flag.');
            } else if (this.args.unblock) {
                return initMessage.edit('That user is not blocked!');
            }

            return initMessage.edit(stripIndents`
            Error occurred while ${type} user.
            \`\`\`apache
            ${body.error.code}
            
            ${body.error.info}
            \`\`\``);
        }

        return this.message.util.send('Successfully blocked user!');
    }
 }

module.exports = BlockAction;
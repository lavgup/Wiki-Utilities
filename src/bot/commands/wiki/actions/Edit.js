const Action = require('./Action');

class EditAction extends Action {
    constructor(data) {
        super(data);

        this.message = data.message;
        this.args = data.args;
    }

    async exec() {
        const latestMessage = await this.message.util.send('Editing page...');

        try {
            await this.bot.login();

            if (this.args.pos === 'prepend') {
                await this.bot.prepend({
                    title: this.args.page,
                    content: `${this.args.content}\n`,
                    summary: this.args.summary
                });
            }

            if (this.args.pos === 'append') {
                await this.bot.append({
                    title: this.args.page,
                    content: `\n${this.args.content}`,
                    summary: this.args.summary
                });
            }

            return latestMessage.edit('Successfully edited contents of page.');
        } catch (err) {
            return latestMessage.edit(err.message);
        }
    }
}

module.exports = EditAction;
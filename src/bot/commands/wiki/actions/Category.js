const Action = require('./Action');
const { stripIndents } = require('common-tags');

class CategoryAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.client = this.message.client;

        this.args = data.args;
    }

    async exec() {
        const latestMessage = await this.message.channel.send(`Getting pages in category **${this.args.category}**...`);

        try {
            let pages = await this.bot.getPagesInCategory(`Category:${this.args.category}`, true);
            if (!pages || !pages.length) {
                return latestMessage.edit(stripIndents`
                The **${this.args.category}** category is empty!
                <${this.bot.server}/wiki/Category:${encodeURIComponent(this.args.category)}
                `);
            }

            pages = pages.map(page => {
                return `[${page}](<${this.bot.server}/wiki/${encodeURIComponent(page)})`;
            });

            return latestMessage.edit('', {
                embed: {
                    color: 'YELLOW',
                    description: this.client.util.trimArray(pages, 25).join('\n')
                }
            });
        } catch (err) {
            return latestMessage.edit(err.message);
        }
    }
}

module.exports = CategoryAction;
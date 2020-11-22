const i18n = require('i18next');
const Action = require('./Action');

class CategoryAction extends Action {
    constructor(data) {
        super(data);
        this.message = data.message;
        this.client = this.message.client;
        this.args = data.args;
    }

    async exec() {
        const latestMessage = await this.message.channel.send(i18n.t('commands.category.fetching', { category: this.args.category }));

        try {
            let pages = await this.bot.getPagesInCategory(`${i18n.t('commands.category.category')}:${this.args.category}`, true);
            if (!pages || !pages.length) {
                return latestMessage.edit(this.client.fmt.stripIndents(`
                ${i18n.t('commands.category.empty', { category: this.args.category })}
                <${this.bot.server}/wiki/${i18n.t('commands.category.category')}:${encodeURIComponent(this.args.category)}>
                `));
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
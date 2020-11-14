const i18n = require('i18next');
const PostAction = require('./actions/Post');
const Command = require('../../structs/Command');

class PostCommand extends Command {
    constructor() {
        super('post', {
            aliases: ['post', 'discuss'],
            description: i18n.t('commands.post.description', { returnObjects: true }),
            channel: 'guild',
            category: 'wiki',
            args: [
                {
                    id: 'title',
                    type: 'string',
                    prompt: {
                        start: message => i18n.t('commands.post.prompt.title', { author: `<@${message.author.id}>` })
                    }
                },
                {
                    id: 'content',
                    type: 'string',
                    prompt: {
                        start: message => i18n.t('commands.post.prompt.content', { author: `<@${message.author.id}>` })
                    }
                }
            ]
        });
    }

    exec(message, args) {
        return new PostAction({
            message,
            args
        }).commit();
    }
}

module.exports = PostCommand;
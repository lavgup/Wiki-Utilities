const Util = require('./Util');
const { join } = require('path');
const i18next = require('i18next');
const Command = require('./Command');
const Backend = require('i18next-fs-backend');
const { readdirSync, lstatSync } = require('fs');
const { Intents: { FLAGS } } =  require('discord.js');
const MediaWikiJS = require('@sidemen19/mediawiki.js');
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo');

class Client extends AkairoClient {
    constructor(config) {
        super(
            { ownerID: config.owners },
            {
                disableMentions: 'everyone',
                partials: [
                    'MESSAGE',
                    'REACTION',
                    'USER',
                    'GUILD_MEMBER'
                ],
                ws: {
                    intents: [
                        FLAGS.GUILDS,
                        FLAGS.GUILD_MESSAGES,
                        FLAGS.GUILD_MESSAGE_REACTIONS
                    ]
                }
            }
        );
        this.config = config;

        const dir = name => join(this.config.root, name);

        this.commandHandler = new CommandHandler(this, {
            directory: dir('commands'),
            prefix: config.prefixes,
            classToHandle: Command,
            aliasReplacement: /-/g,
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 3e5,
            defaultCooldown: 3000,
            argumentDefaults: {
                prompt: {
                    modifyStart: (_, str) => `${str}\n\nType \`cancel\` to cancel the command.`,
                    modifyRetry: (_, str) => `${str}\n\nType \`cancel\` to cancel the command.`,
                    timeout: `You took too long to respond, command has been cancelled.`,
                    ended: `More than 3 tries and you still didn't quite get it. The command has been cancelled.`,
                    cancel: `Alright, the command has been cancelled.`,
                    retries: 3,
                    time: 30000
                },
                otherwise: ''
            }
        });

        this.listenerHandler = new ListenerHandler(this, { directory: dir('listeners') });
        this.inhibitorHandler = new InhibitorHandler(this, { directory: dir('inhibitors') });

        this.util = new Util(this);

        this.bot = new MediaWikiJS({
            server: config.wiki.url,
            path: '',
            botUsername: config.wiki.credentials.username,
            botPassword: config.wiki.credentials.password
        });

        this.commandHandler.resolver.addType('summary', (message, phrase) => {
            if (this.config.wiki.user_map.enabled
                &&  this.config.wiki.user_map[message.author.id]
            ) {
                return `${phrase} - [[User:${this.config.wiki.user_map[message.author.id]}|${this.config.wiki.user_map[message.author.id]}]]`;
            }

            return `${phrase} - ${message.author.tag}`;
        });

        this.commandHandler.resolver.addType('duration', (message, phrase) => {
            if (!phrase) return null;

            if (!/^never|in(?:finit[ey]|definite)$/i.test(phrase)) {
                const timeRegex = /^(-?(?:\d+)?\.?\d+) *(minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i;
                if (!timeRegex.test(phrase)) return null;

                const match = timeRegex.exec(phrase);
                const n = parseFloat(match[1]);
                const type = (match[2] || 'ms').toLowerCase();
                switch (type) {
                    case 'years':
                    case 'year':
                    case 'yrs':
                    case 'yr':
                    case 'y':
                        return `${n} years`;
                    case 'months':
                    case 'month':
                    case 'mo':
                        return `${n} months`;
                    case 'weeks':
                    case 'week':
                    case 'w':
                        return `${n} weeks`;
                    case 'days':
                    case 'day':
                    case 'd':
                        return `${n} days`;
                    case 'hours':
                    case 'hour':
                    case 'hrs':
                    case 'hr':
                    case 'h':
                        return `${n} hours`;
                    case 'minutes':
                    case 'minute':
                    case 'mins':
                    case 'min':
                    case 'm':
                        return `${n} minutes`;
                    default:
                        return null;
                }
            }

            return null;
        });
    }

    loadTranslations() {
        /* eslint-disable no-undef */
        i18next
            .use(Backend)
            .init({
                initImmediate: true,
                fallbackLng: 'en',
                lng: this.config.lang,
                preload: readdirSync(join(__dirname, '../../locales')).filter(fileName => {
                    const joinedPath = join(join(__dirname, '../../locales'), fileName);
                    return lstatSync(joinedPath).isDirectory();
                }),
                ns: ['main'],
                defaultNS: 'main',
                backend: {
                    loadPath: join(__dirname, '../../locales/{{lng}}/{{ns}}.json')
                }
            }).then(() => console.log('Loaded translations!'));
        /* eslint-enable no-undef */
    }

    start() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();

        this.loadTranslations();

        return super.login(this.config.token);
    }
}

module.exports = Client;
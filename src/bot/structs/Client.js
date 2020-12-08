const Util = require('./Util');
const { join } = require('path');
const logger = require('./Logger');
const i18next = require('i18next');
const Command = require('./Command');
const Formatter = require('./Formatter');
const Backend = require('i18next-fs-backend');
const PluginHandler = require('./PluginHandler');
const { readdirSync, lstatSync } = require('fs');
const { Intents: { FLAGS } } =  require('discord.js');
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
                        FLAGS.GUILD_MESSAGE_REACTIONS,
                        FLAGS.DIRECT_MESSAGES
                    ]
                }
            }
        );
        this.config = config;

        this.logger = logger;
        this.fmt = new Formatter();
        this.util = new Util();
    }

    async loadTranslations() {
        /* eslint-disable no-undef */
        await i18next
            .use(Backend)
            .init({
                lng: this.config.lang,
                returnEmptyString: false,
                fallbackLng: 'en',
                preload: readdirSync(join(__dirname, '../../locales')).filter(fileName => {
                    const joinedPath = join(join(__dirname, '../../locales'), fileName);
                    return lstatSync(joinedPath).isDirectory();
                }),
                ns: ['main'],
                defaultNS: 'main',
                backend: {
                    loadPath: join(__dirname, '../../locales/{{lng}}/{{ns}}.json')
                }
            });

        this.logger.info(`Loaded translations! Using lang ${this.config.lang}`);
        /* eslint-enable no-undef */
    }

    initHandlers() {
        const dir = name => join(this.config.root, name);

        this.commandHandler = new CommandHandler(this, {
            directory: dir('commands'),
            prefix: this.config.prefixes,
            classToHandle: Command,
            aliasReplacement: /-/g,
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 3e5,
            defaultCooldown: 3000,
            argumentDefaults: {
                prompt: {
                    modifyStart: (_, str) => `${str}\n\n${i18next.t('handler.prompt.cancel')}`,
                    modifyRetry: (_, str) => `${str}\n\n${i18next.t('handler.prompt.cancel')}`,
                    timeout: i18next.t('handler.prompt.timeout'),
                    ended: i18next.t('handler.prompt.ended'),
                    cancel: i18next.t('handler.prompt.cancelled'),
                    retries: 3,
                    time: 30000
                },
                otherwise: ''
            }
        });

        this.addArgumentTypes();

        this.listenerHandler = new ListenerHandler(this, { directory: dir('listeners') });
        this.inhibitorHandler = new InhibitorHandler(this, { directory: dir('inhibitors') });
        this.pluginHandler = new PluginHandler(this, {directory: dir('plugins') });
    }

    addArgumentTypes() {
        this.commandHandler.resolver.addType('summary', (message, phrase) => {
            const { id } = message.util.parsed.command;
            
            const reason = phrase || (id === 'edit'
                ? i18next.t('general.no_summary')
                : i18next.t('general.no_reason'));

            let username;

            if (this.config.user_map.enabled
                && this.config.user_map[message.author.id]
            ) username = this.config.user_map[message.author.id];
            
            const string = this.config.summaries[id][username ? 'is_mapped' : 'not_mapped' ];

            return string
                .replace('$reason', reason)
                .replace('$summary', reason)
                .replace('$tag', message.author.tag)
                .replace('$username', username);
        });

        this.commandHandler.resolver.addType('duration', (message, phrase) => {
            if (!phrase) return null;

            if (!this.config.infinite_lengths.includes(phrase.toLowerCase())) {
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

            return 'infinite';
        });
    }

    async start() {
        await this.loadTranslations();
        this.initHandlers();

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
        this.pluginHandler.loadAll();

        this.logger.info('Loaded handlers!');

        return super.login(this.config.token);
    }
}

module.exports = Client;
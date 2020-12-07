const i18n = require('i18next');
const { inspect } = require('util');
const { Collection } = require('discord.js');
const Command = require('../../structs/Command');

class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval', 'evaluate'],
            description: i18n.t('commands.eval.description', { returnObjects: true }),
            ownerOnly: true,
            category: 'owner',
            args: [
                {
                    id: 'code',
                    type: 'string',
                    match: 'content',
                    prompt: {
                        start: message => i18n.t('commands.eval.prompt', { author: message.author.toString() })
                    }
                }
            ]
        });
    }

    async exec(message, { code }) {
        if (code.startsWith('```') && code.endsWith('```')) {
            code = code.slice(3, -3);
            if (['js', 'javascript'].includes(code.split('\n', 1)[0])) {
                code = code.replace(/^.+/, '');
            }
        }
        code = code.replace(/;+$/g, '');

        const send = (...args) => {
            args = args.map(arg => {
                if (String(arg) === '[object Object]') {
                    // eslint-disable-next-line no-prototype-builtins
                    if (arg.hasOwnProperty('embed')) {
                        return arg;
                    }
                }

                return this.stringify(arg);
            });

            return message.util.send(...args);
        };
        try {
            const isAsync = code.includes('await');
            const isSingleStatement = !code.includes(';');

            if (isAsync) {
                const promise = eval(`(async () => {
                    ${isSingleStatement ? 'return ' : ''}${code};
                })()`);
                const result = await promise;

                if (result !== undefined) {
                    const message = this.stringify(result, true);

                    if (message) {
                        await send(message);
                    }
                }
            } else {
                const result = eval(code);

                if (result !== undefined) {
                    const message = this.stringify(result, true);

                    if (message) {
                        await send(message);
                    }
                }
            }
        } catch (e) {
            await send(`\`\`\`http\n${e}\n\`\`\``);
        }
    }

    inspect(object) {
        let str = '';
        let depth = 3;

        while (depth--) {
            str = `\`\`\`js\n${inspect(object, { depth, compact: false })}\n\`\`\``;

            if (str.length < 2000) break;
        }

        return str;
    }

    stringify(val, forCode) {
        if (val instanceof Collection) {
            if (forCode) {
                val = val.array();
            } else {
                return val.array();
            }
        }

        if (val instanceof Array) {
            if (forCode) {
                const json = JSON.stringify(val, null, 2);

                return `\`\`\`json\n${json}\n\`\`\``;
            }

            return val;
        }

        if (val instanceof Promise) {
            if (forCode) return null;

            return val;
        }

        if (val instanceof Function) {
            const stringified = val.toString();
            const lastLine = stringified.slice(stringified.lastIndexOf('\n') + 1);
            const [indent] = lastLine.match(/^\s*/);

            return `\`\`\`js\n${indent + stringified}\n\`\`\``;
        }

        if (val instanceof Map) {
            return this.inspect(val);
        }

        if (String(val) === '[object Object]') {
            try {
                const json = JSON.stringify(val, null, 2);
                return `\`\`\`json\n${json}\n\`\`\``;
            } catch (e) {
                return this.inspect(val);
            }
        }

        if (typeof val === 'string' && val === '') {
            const json = JSON.stringify(val);

            if (forCode) {
                return `\`\`\`json\n${json}\n\`\`\``;
            }

            return json;
        }

        if (typeof val === 'boolean') {
            return String(val);
        }

        return val;
    }
}

module.exports = EvalCommand;
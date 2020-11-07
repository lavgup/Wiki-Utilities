const { ClientUtil } = require('discord-akairo');

class Util extends ClientUtil {
    constructor(client) {
        super(client);
        this.client = client;
    }

    capitalise(string) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    react(message, ...emojis) {
        return emojis.forEach(emoji => message.react(emoji));
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    trimArray(arr, maxLen = 15) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }

        return arr;
    }
}

module.exports = Util;
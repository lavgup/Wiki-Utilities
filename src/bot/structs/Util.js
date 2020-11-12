const i18n = require('i18next');
const { ClientUtil } = require('discord-akairo');

class Util extends ClientUtil {
    constructor(client) {
        super(client);
        this.client = client;
    }

    capitalise(string) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    trimArray(arr, maxLen = 15) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} ${i18n.t('general.more')}...`);
        }

        return arr;
    }
}

module.exports = Util;
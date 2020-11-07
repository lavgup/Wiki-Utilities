const { Command } = require('discord-akairo');

class WUCommand extends Command {
    wait(ms, val) {
        return new Promise(res => setTimeout(res.bind(this, val), ms));
    }
}

module.exports = WUCommand;
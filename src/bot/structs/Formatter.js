class Formatter {
    stripIndents(content) {
        return content
            .trim()
            .replace(/^[^\S\n]+/gm, '');
    }
}

module.exports = Formatter;
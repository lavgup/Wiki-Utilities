# Wiki Utilities[<img src="https://weblate.frisk.space/widgets/wiki-utilities/-/svg-badge.svg" alt="Translations" align="right" />](#translations)
Wiki Utilities is a Discord bot, which allows wiki (think Fandom, Wikipedia) admins to take administrative actions, such as deleting, moving, protecting pages and more, through Discord. As Wiki Utilities requires credentials, it is a self-hosted bot, meaning you need to host it yourself to use it.

### Features
* Blocking users.
* Listing pages in a category.
* Deleting pages.
* Editing pages.
* Moving (i.e. renaming) pages.
* Modifying the protection levels of pages.
* Undeleting (i.e. restoring) pages.
* Multilingual, currently supporting English, Polish and Hindi ([add more!](https://weblate.frisk.space/projects/wiki-utilities/bot/)).
* Integration with [RcGcDw](https://gitlab.com/piotrex43/RcGcDw/) (see [#110](https://gitlab.com/piotrex43/RcGcDw/-/issues/110)), allowing admins to lazily react to log messages with emojis, to either block the user, revert the edit, or delete the page.

### Installing
Note: as the bot uses some newer technology, including optional chaining and private class fields, it requires at least Node.js v14. Running the bot with a version lower than this will lead to an error on startup.
You will also need Git and a package manager such as [pnpm](https://pnpm.js.org) installed.

1. Clone this repo to your machine by running `git clone https://github.com/Sidemen19/Wiki-Utilities.git`.
2. Rename `config.sample.json` to `config.json`.
3. Go to the Discord developer's website while you are logged in to your Discord account [here](https://discordapp.com/developers/applications/).
    * Create a new application.
    * Copy the Client ID.
    * Next, add a Bot (NOTE - you need to make the bot private (meaning only you can invite it to servers), by toggling the switch).

4. Get the bot's token from the Bot page, copy it, and paste it into the value of `token` in [config.json](config.sample.json).
5. Invite Wiki Utilities to a server, by going to `https://discord.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=330816`.
6. Install required dependencies, using `pnpm install` or `npm install`.
7. Get the bot online by running `node .` in the root directory.

### Configuration
All configuration options are stored in [config.json](config.sample.json).

* `token`: The token of the bot. Get this by following the above instructions.
* `prefixes`: An array of all the prefixes the bot recognises. Defaults to just `wu!`.
* `lang`: The language you want the bot to respond with. Currently supports `en`, `pl` and `hi`.
* `owners`: An array of all the owners of the bot. Put your Discord ID here, and any others if you want. **The owners of the bot bypass all restrictions!** Be careful with who you give this to.
  
* `guilds`: The object which holds configuration data for each guild. Information on what is required here is below.
* `infinite_lengths`: What the bot will recognise as "infinite" lengths for block and protect commands.  
* `user_map` A map of user IDs to their wiki usernames. Example of this configuration would be `"441164156016787486": "Sidemen19"`. If this option is disabled or missing an ID, it will display the author's Discord tag, instead of their wiki username in edit summaries and reasons.
* `summaries` The format summaries and reasons will be in.
    * Supported variables for the formats are:
        * `$reason`/`$summary`: The reason provided when using the command.
        * `$tag`: The message author's Discord tag.
        * `$username`: The message author's wiki username, if existent in the user map.
    
    * The string dynamically changes depending on whether the message author's id exists in the user map, so there are two options for each command.
    * If you are confused, check `config.sample.json` out.

#### Wiki Object
* `url`: The URL to the wiki. Example: `https://community.fandom.com`
* `path`: The path to the wiki's api.php file. For example, all Fandom wikis' path is an empty string as the file's located at `c.fandom.com/api.php`, but wikipedia has `/w` as their path as their api.php file is located at `en.wikipedia.org/w/api.php`  
* `allowed_roles`: An array of role IDs, the members of it will be able to take administrative wiki actions. (NOTE: give this only to a trusted role, this is basically giving admin rights to whoever is in this role). Owners of the bot bypass this.
* `blacklisted_users`: An array of user IDs, this overrides `allowed_roles`, removing the right from any untrustworthy users.
* `defaults`  
   * `allow_user_talk`: Whether the bot should block the user from editing their talk page.
   * `autoblock`: Whether to automatically block the last used IP address, and any subsequent IP addresses they try to login from.
   * `reblock`: Whether to override an existing block. 
* `rcgcdw_extension`
   * `enabled`: Whether the extension is enabled or not.
   * `channel_ids`: An array of all logging channel IDs.
   * `mode`: `compact` or `embed`. Whether your RcGcDw script is running in compact or embed mode.
   * `wiki_name`: The name of the wiki that the RC script is running for.
   * `block_duration`: The block duration applied to the block when using the block reaction. As the system is all reaction-based, this isn't modifiable at the time of block.
   * `emojis`: Any unicode emojis to use when reacting, instead of the default regional indicators.
* `credentials` (these must be obtained from `Special:BotPasswords`)
    * `username`: The username. (it is recommended to use a separate bot account, and give that admin rights, instead of your main account).
    * `password`: The bot password. Obtain this from Special:Botpasswords.
        
### RcGcDw extension
One of Wiki Utilities' main features is its support for [RcGcDw](https://gitlab.com/piotrex43/RcGcDw/). What admins can do with this feature, is as a log entry comes through, react with an emoji, to do one of the following:
* `:regional_indicator_b`: Blocks the user who created/edited the page.
* `:regional_indicator_d`: Deletes the page edited/created.
* `:regional_indicator_r`: Reverts the edit.

Example usage: ![example](https://i.imgur.com/jPA80tk.gif)

The extension supports both compact and embed mode.

### Translations
[<img src="https://weblate.frisk.space/widgets/wiki-utilities/-/multi-auto.svg" alt="Translation status" width="80%" />](https://weblate.frisk.space/engage/wiki-utilities/?utm_source=widget)

### Support
https://discord.com/invite/2ZjJbBJ

const config = require('../config.json');

module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    // Ignore messages not starting with the prefix (in config.json)
    if (!message.content.startsWith(config.prefix)) return;

    // Our standard argument/command name definition.
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    // Grab the command data from the client.commands Enmap
    const command = client.commands.get(commandName);

    // If that command doesn't exist, silently exit and do nothing
    if (!command) return;

    // Run the command
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
};

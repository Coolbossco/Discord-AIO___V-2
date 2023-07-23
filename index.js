const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const Client = require('./client/client.js');
const config = require('./config.json');
const glob = require('glob');
const { TicketManager } = require('discord-tickets');

const client = new Client();
client.commands = new Discord.Collection();

fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`👌 Event loaded: ${eventName}`);
        console.log(`Event is a ${typeof event}`);
        if (typeof event !== 'function') {
            console.log(`Event file: ${file}`);
            console.log(event);
        } else {
            client.on(eventName, event.bind(null, client));
            delete require.cache[require.resolve(`./events/${file}`)];
        }
    });
});

client.commands = new Discord.Collection();
client.ticketManager = new TicketManager(client, config.ticketManager);

const commandFiles = glob.sync("./commands/**/*.*");
commandFiles.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(path.resolve(file));
    let commandName = path.basename(file, '.js');
    client.commands.set(commandName, props);
    console.log(`👌 Command loaded: ${commandName}`);
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    // Log the command usage
    client.logCommand(message);

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.login(config.token);
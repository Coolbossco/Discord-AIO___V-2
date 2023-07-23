const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const Client = require('./client/client.js');
const config = require('./config.json');
const glob = require('glob');
const readline = require('readline');
const { TicketManager } = require('discord-tickets');

const client = new Client();
client.commands = new Discord.Collection();
client.ticketManager = new TicketManager(client, config.ticketManager);

// Function to load events
const loadEvents = () => {
    fs.readdir("./events/", (_err, files) => {
        files.forEach((file) => {
            if (!file.endsWith(".js")) return;
            delete require.cache[require.resolve(`./events/${file}`)];
            const event = require(`./events/${file}`);
            let eventName = file.split(".")[0];
            console.log(`👌 Event loaded: ${eventName}`);
            client.on(eventName, event.bind(null, client));
        });
    });
}

// Function to load commands
const loadCommands = () => {
    client.commands.clear();
    const commandFiles = glob.sync("./commands/**/*.*");
    commandFiles.forEach((file) => {
        if (!file.endsWith(".js")) return;
        delete require.cache[require.resolve(path.resolve(file))];
        let props = require(path.resolve(file));
        let commandName = path.basename(file, '.js');
        client.commands.set(commandName, props);
        console.log(`👌 Command loaded: ${commandName}`);
    });
}

// Load events and commands
loadEvents();
loadCommands();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    client.logCommand(message);

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.login(config.token);

// Terminal input for refreshing commands and events
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if (input.toLowerCase() === 'refresh') {
        console.clear(); // clear terminal
        console.log('Refreshing commands and events...');
        try {
            loadEvents();
            loadCommands();
            console.log('Refreshed successfully.');
        } catch (error) {
            console.error(`Error occurred during refreshing: ${error}`);
        }
    }
});
const backup = require('discord-backup');

module.exports = {
    name: 'create-backup',
    description: 'Create a backup of the server.',
    async execute(message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send(':x: You need to have the manage messages permissions to create a backup in this server.');
        }

        backup.create(message.guild).then((backupData) => {
            return message.channel.send('Backup created! Here is your ID: `'+backupData.id+'`! Use `'+config.prefix+'load-backup '+backupData.id+'` to load the backup on another server!');
        }).catch(() => {
            return message.channel.send(':x: An error occurred, please check if the bot is administrator!');
        });
    },
};

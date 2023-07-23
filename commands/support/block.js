const ms = require('ms');
const { readBlockedUsers, writeBlockedUsers } = require('../../utility/support');

module.exports = {
    name: 'block',
    description: 'Block a user from creating tickets for a certain period.',
    execute(message, args) {
        const user = message.mentions.users.first();
        let time = args[1];

        if (!user) {
            return message.reply('You must mention a user to block them.');
        }

        const blockedUsers = readBlockedUsers();

        if (!time) {
            blockedUsers[user.id] = {
                permanent: true
            };
        } else {
            blockedUsers[user.id] = {
                until: Date.now() + ms(time),
                permanent: false
            };
        }

        writeBlockedUsers(blockedUsers);

        message.reply(`User ${user.tag} has been blocked from creating tickets.`);
    },
};

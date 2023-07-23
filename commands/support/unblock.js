const { readBlockedUsers, writeBlockedUsers } = require('../../utility/support');

module.exports = {
    name: 'unblock',
    description: 'Unblock a user from creating tickets.',
    execute(message, args) {
        const user = message.mentions.users.first();

        if (!user) {
            return message.reply('You must mention a user to unblock them.');
        }

        const blockedUsers = readBlockedUsers();

        if (!blockedUsers[user.id]) {
            return message.reply('This user is not blocked.');
        }

        delete blockedUsers[user.id];
        writeBlockedUsers(blockedUsers);

        message.reply(`User ${user.tag} has been unblocked from creating tickets.`);
    },
};

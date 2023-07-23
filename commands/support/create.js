module.exports = {
    name: 'create',
    description: 'Create a new ticket.',
    async execute(message, args) {
        // your check for blocked users here
        await message.client.ticketManager.createTicket(message.guild, message.author);
        message.reply('Ticket has been created!');
    },
};

module.exports = {
    name: 'tempclose',
    description: 'Close a ticket after a certain period.',
    async execute(message, args) {
        const time = args[0];
        const ticket = message.client.ticketManager.tickets.get(message.channel.id);

        if (!time) {
            return message.reply('You must provide a time period for closing the ticket.');
        }

        if (ticket) {
            setTimeout(async () => {
                await ticket.channel.delete();
                message.reply('Ticket has been closed!');
            }, ms(time));
        } else {
            message.reply('This command can only be used in ticket channels.');
        }
    },
};

module.exports = {
    name: 'ping',
    description: 'Check bot response time',
    usage: '.ping',
    execute(message, args) {
        message.reply('Pong! 🏓');
    }
};

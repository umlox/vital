const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'purge',
    aliases: ['clear'],
    description: 'Deletes specified amount of messages',
    usage: '.purge <amount>',
    category: 'Moderation',
    async execute(message, args) {
        // Check if user has permission
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;

        // Get amount to delete
        const amount = parseInt(args[0]);
        if (isNaN(amount)) return;
        
        // Delete command message first
        await message.delete();

        // Delete specified messages
        await message.channel.bulkDelete(amount, true);
    }
};
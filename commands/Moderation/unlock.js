const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unlock',
    description: 'Unlocks the current channel',
    usage: '.unlock',
    category: 'Moderation',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('You need Manage Channels permission to use this command.');
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: true,
                AddReactions: true
            });
            
            await message.react('👍');
        } catch (error) {
            console.error(error);
            message.reply('Failed to unlock the channel.');
        }
    }
};
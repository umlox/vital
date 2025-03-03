const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Locks the current channel',
    usage: '.lock',
    category: 'Moderation',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('You need Manage Channels permission to use this command.');
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: false,
                AddReactions: false
            });
            
            await message.react('👍');
        } catch (error) {
            console.error(error);
            message.reply('Failed to lock the channel.');
        }
    }
};

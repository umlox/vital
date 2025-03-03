const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'nuke',
    description: 'Nukes (clones and deletes) the current channel',
    usage: '.nuke',
    category: 'Moderation',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('You need Manage Channels permission to use this command.');
        }

        const channel = message.channel;
        const channelPosition = channel.position;

        try {
            // Create new channel with same settings
            const newChannel = await channel.clone({
                position: channelPosition,
                reason: `Nuked by ${message.author.tag}`
            });

            // Delete the old channel
            await channel.delete();

            // Send confirmation message in new channel
            await newChannel.send(`Channel has been nuked by ${message.author}`);

            // Set the position explicitly after creation
            await newChannel.setPosition(channelPosition);
            
        } catch (error) {
            console.error(error);
            message.reply('Failed to nuke the channel.');
        }
    }
};

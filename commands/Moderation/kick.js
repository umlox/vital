const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    aliases: ['k'],
    description: 'Kicks a user from the server',
    usage: '.kick <user> [reason]',
    category: 'Moderation',
    async execute(message, args) {
        // Permission check
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply('You do not have permission to kick members.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a user to kick.');
        }

        // Check if bot can kick the target
        if (!target.kickable) {
            return message.reply('I cannot kick this user. They may have higher permissions than me.');
        }

        // Get reason if provided
        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await target.kick(reason);

            const kickEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setTitle('User Kicked')
                .addFields(
                    { name: 'User', value: `${target.user.tag}`, inline: true },
                    { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.reply({ embeds: [kickEmbed] });
        } catch (error) {
            console.error(error);
            message.reply('Failed to kick the user.');
        }
    }
};
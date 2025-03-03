const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ban',
    aliases: ['b'],
    description: 'Bans a user from the server',
    usage: '.ban <user> [days] [reason]',
    category: 'Moderation',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('You do not have permission to ban members.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a user to ban.');
        }

        if (!target.bannable) {
            return message.reply('I cannot ban this user. They may have higher permissions than me.');
        }

        let days = 0;
        let reason;

        if (args[1] && !isNaN(args[1]) && args[1] <= 7) {
            days = parseInt(args[1]);
            reason = args.slice(2).join(' ') || 'No reason provided';
        } else {
            reason = args.slice(1).join(' ') || 'No reason provided';
        }

        try {
            await target.ban({ 
                deleteMessageDays: days,
                reason: reason 
            });

            const banEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setTitle('User Banned')
                .addFields(
                    { name: 'User', value: `${target.user.tag}`, inline: true },
                    { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                    { name: 'Message Delete Days', value: `${days}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.reply({ embeds: [banEmbed] });
        } catch (error) {
            console.error(error);
            message.reply('Failed to ban the user.');
        }
    }
};
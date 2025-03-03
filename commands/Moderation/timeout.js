const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

function parseTime(time) {
    const timeUnit = time.slice(-1).toLowerCase();
    const timeValue = parseInt(time.slice(0, -1));
    
    switch(timeUnit) {
        case 's':
            return timeValue * 1000;
        case 'm':
            return timeValue * 60000;
        case 'h':
            return timeValue * 3600000;
        case 'd':
            return timeValue * 86400000;
        case 'w':
            return timeValue * 604800000;
        default:
            return null;
    }
}

function formatTime(ms) {
    if (ms >= 604800000) return `${Math.floor(ms / 604800000)}w`;
    if (ms >= 86400000) return `${Math.floor(ms / 86400000)}d`;
    if (ms >= 3600000) return `${Math.floor(ms / 3600000)}h`;
    if (ms >= 60000) return `${Math.floor(ms / 60000)}m`;
    return `${Math.floor(ms / 1000)}s`;
}

module.exports = {
    name: 'timeout',
    aliases: ['to', 'mute'],
    description: 'Timeout a user for a specified duration (1s, 1m, 1h, 1d, 1w)',
    usage: '.timeout <user> <duration> [reason]',
    category: 'Moderation',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('You do not have permission to timeout members.');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a user to timeout.');
        }

        if (!target.moderatable) {
            return message.reply('I cannot timeout this user. They may have higher permissions than me.');
        }

        const duration = args[1];
        if (!duration) {
            return message.reply('Please specify a duration (Example: 1m, 1h, 1d, 1w)');
        }

        const durationInMs = parseTime(duration);
        if (!durationInMs || durationInMs < 1000 || durationInMs > 2419200000) {
            return message.reply('Duration must be between 1s and 28d (Example: 30s, 1h, 7d)');
        }

        const reason = args.slice(2).join(' ') || 'No reason provided';

        try {
            await target.timeout(durationInMs, reason);

            const timeoutEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setTitle('User Timed Out')
                .addFields(
                    { name: 'User', value: `${target.user.tag}`, inline: true },
                    { name: 'Duration', value: formatTime(durationInMs), inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.reply({ embeds: [timeoutEmbed] });
        } catch (error) {
            console.error(error);
            message.reply('Failed to timeout the user.');
        }
    }
};
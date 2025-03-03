const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'nick',
    description: 'Change a user\'s nickname',
    usage: '.nick <user> <nickname>',
    category: 'Moderation',
    execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
            const embed = new EmbedBuilder()
                .setDescription('❌ You need Manage Nicknames permission.')
                .setColor(0x000000);
            return message.reply({ embeds: [embed] });
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const nickname = args.slice(1).join(' ');

        if (!target || !nickname) {
            const embed = new EmbedBuilder()
                .setDescription('❌ Please provide a user and new nickname.')
                .setColor(0x000000);
            return message.reply({ embeds: [embed] });
        }

        target.setNickname(nickname)
            .then(() => {
                const embed = new EmbedBuilder()
                    .setDescription(`✅ Changed ${target}'s nickname to: ${nickname}`)
                    .setColor(0x000000);
                message.reply({ embeds: [embed] });
            })
            .catch(() => {
                const embed = new EmbedBuilder()
                    .setDescription('❌ Unable to change nickname.')
                    .setColor(0x000000);
                message.reply({ embeds: [embed] });
            });
    }
};
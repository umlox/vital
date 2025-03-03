const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'resetnick',
    description: 'Reset a user\'s nickname to their username',
    usage: '.resetnick <user>',
    category: 'Moderation',
    execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
            const embed = new EmbedBuilder()
                .setDescription('❌ You need Manage Nicknames permission.')
                .setColor(0x000000);
            return message.reply({ embeds: [embed] });
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!target) {
            const embed = new EmbedBuilder()
                .setDescription('❌ Please mention a user.')
                .setColor(0x000000);
            return message.reply({ embeds: [embed] });
        }

        target.setNickname(null)
            .then(() => {
                const embed = new EmbedBuilder()
                    .setDescription(`✅ Reset ${target}'s nickname`)
                    .setColor(0x000000);
                message.reply({ embeds: [embed] });
            })
            .catch(() => {
                const embed = new EmbedBuilder()
                    .setDescription('❌ Unable to reset nickname.')
                    .setColor(0x000000);
                message.reply({ embeds: [embed] });
            });
    }
};
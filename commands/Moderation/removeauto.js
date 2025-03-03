const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const autoRoleFile = path.join(__dirname, '../../data/autoroles.json');

module.exports = {
    name: 'removeauto',
    description: 'Removes the autorole setting for this server',
    usage: '.removeauto',
    category: 'Moderation',
    execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const noPermsEmbed = new EmbedBuilder()
                .setDescription('❌ You need Manage Roles permission to use this command.')
                .setColor(0x000000);
            return message.reply({ embeds: [noPermsEmbed] });
        }

        let autoRoles = JSON.parse(fs.readFileSync(autoRoleFile, 'utf8'));

        if (!autoRoles[message.guild.id]) {
            const noRoleEmbed = new EmbedBuilder()
                .setDescription('❌ No autorole is currently set.')
                .setColor(0x000000);
            return message.reply({ embeds: [noRoleEmbed] });
        }

        delete autoRoles[message.guild.id];
        fs.writeFileSync(autoRoleFile, JSON.stringify(autoRoles, null, 4));

        const successEmbed = new EmbedBuilder()
            .setDescription('✅ Autorole has been removed.')
            .setColor(0x000000);
        
        message.reply({ embeds: [successEmbed] });
    }
};
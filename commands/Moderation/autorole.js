const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const autoRoleFile = path.join(dataDir, 'autoroles.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

if (!fs.existsSync(autoRoleFile)) {
    fs.writeFileSync(autoRoleFile, '{}', 'utf8');
}

module.exports = {
    name: 'autorole',
    description: 'Set a role to be automatically given to new members',
    usage: '.autorole <role>',
    category: 'Moderation',
    execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const noPermsEmbed = new EmbedBuilder()
                .setDescription('❌ You need Manage Roles permission to use this command.')
                .setColor(0x000000);
            return message.reply({ embeds: [noPermsEmbed] });
        }

        let autoRoles = JSON.parse(fs.readFileSync(autoRoleFile, 'utf8'));

        if (!args.length) {
            const currentRole = autoRoles[message.guild.id] ? 
                message.guild.roles.cache.get(autoRoles[message.guild.id]) : 
                'No role set';
            
            const currentEmbed = new EmbedBuilder()
                .setDescription(`Current autorole: ${currentRole}`)
                .setColor(0x000000);
            return message.reply({ embeds: [currentEmbed] });
        }

        const role = message.mentions.roles.first() || 
            message.guild.roles.cache.get(args[0]) ||
            message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());

        if (!role) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('❌ Please specify a valid role.')
                .setColor(0x000000);
            return message.reply({ embeds: [errorEmbed] });
        }

        autoRoles[message.guild.id] = role.id;
        fs.writeFileSync(autoRoleFile, JSON.stringify(autoRoles, null, 4));

        const successEmbed = new EmbedBuilder()
            .setDescription(`✅ Autorole has been set to: ${role}`)
            .setColor(0x000000);
        
        message.reply({ embeds: [successEmbed] });
    }
};
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'role',
    description: 'Add or remove a role from a user',
    usage: '.role <user> <role>',
    category: 'Moderation',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const noPermsEmbed = new EmbedBuilder()
                .setDescription(`❌ ${message.author}, You need Manage Roles permission to use this command.`)
            return message.reply({ embeds: [noPermsEmbed] });
        }

        if (args.length < 2) {
            const usageEmbed = new EmbedBuilder()
                .setDescription(`❌ Usage: \`.role <user> <role>\``)
            return message.reply({ embeds: [usageEmbed] });
        }

        const targetUser = message.mentions.members.first() || 
            await message.guild.members.fetch(args[0]).catch(() => null);

        if (!targetUser) {
            const invalidUserEmbed = new EmbedBuilder()
                .setDescription(`❌ Please specify a valid user.`)
            return message.reply({ embeds: [invalidUserEmbed] });
        }

        const roleQuery = args.slice(1).join(' ');
        const role = message.mentions.roles.first() || 
            message.guild.roles.cache.get(roleQuery) ||
            message.guild.roles.cache.find(r => r.name.toLowerCase() === roleQuery.toLowerCase());

        if (!role) {
            const invalidRoleEmbed = new EmbedBuilder()
                .setDescription(`❌ Please specify a valid role.`)
            return message.reply({ embeds: [invalidRoleEmbed] });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles) || 
            role.position >= message.guild.members.me.roles.highest.position) {
            const noBotPermsEmbed = new EmbedBuilder()
                .setDescription(`❌ I don't have permission to manage that role.`)
            return message.reply({ embeds: [noBotPermsEmbed] });
        }

        try {
            const successEmbed = new EmbedBuilder()

            if (targetUser.roles.cache.has(role.id)) {
                await targetUser.roles.remove(role);
                successEmbed.setDescription(`✅ Removed role \`${role.name}\` from \`${targetUser.user.tag}\``);
            } else {
                await targetUser.roles.add(role);
                successEmbed.setDescription(`✅ Added role \`${role.name}\` to \`${targetUser.user.tag}\``);
            }
            
            message.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setDescription(`❌ Failed to modify roles.`)
            message.reply({ embeds: [errorEmbed] });
        }
    }
};

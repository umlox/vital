const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { aliases } = require('./help');

module.exports = {
    name: 'roles',
    aliases: ['rls'],
    description: 'Shows all roles in the server',
    usage: '.roles',
    category: 'General',
    async execute(message) {
        const roles = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(role => role.name !== '@everyone')
            .map(role => `<@&${role.id}>`);

        const rolesPerPage = 5;
        const totalPages = Math.ceil(roles.length / rolesPerPage);
        let currentPage = 0;

        const generateEmbed = (page) => {
            const startIndex = page * rolesPerPage;
            const currentRoles = roles.slice(startIndex, startIndex + rolesPerPage);

            const embed = new EmbedBuilder()
                .setTitle(`Server Roles [${roles.length}]`)
                .setDescription(currentRoles.join('\n'))
                .setFooter({ text: `Page ${page + 1}/${totalPages}` })
                .setTimestamp();

            return embed;
        };

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('first')
                    .setLabel('≪')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('last')
                    .setLabel('≫')
                    .setStyle(ButtonStyle.Secondary)
            );

        const msg = await message.reply({
            embeds: [generateEmbed(currentPage)],
            components: [buttons]
        });

        const collector = msg.createMessageComponentCollector({
            time: 60000
        });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    content: 'These buttons are not for you!',
                    ephemeral: true
                });
            }

            switch (interaction.customId) {
                case 'first':
                    currentPage = 0;
                    break;
                case 'previous':
                    currentPage = Math.max(0, currentPage - 1);
                    break;
                case 'next':
                    currentPage = Math.min(totalPages - 1, currentPage + 1);
                    break;
                case 'last':
                    currentPage = totalPages - 1;
                    break;
            }

            await interaction.update({
                embeds: [generateEmbed(currentPage)],
                components: [buttons]
            });
        });

        collector.on('end', () => {
            buttons.components.forEach(button => button.setDisabled(true));
            msg.edit({ components: [buttons] }).catch(() => {});
        });
    }
};

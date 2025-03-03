const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'setlogs',
    description: 'Set the logging channel for server events',
    usage: '.setlogs #channel',
    category: 'Moderation',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('You need Administrator permissions to use this command!');
        }

        const channel = message.mentions.channels.first();
        if (!channel) {
            return message.reply('Please mention a channel to set as the logs channel!');
        }

        const configPath = path.join(__dirname, '../../data/config.json');
        const config = {
            logChannelId: channel.id
        };

        // Ensure the data directory exists
        const dataDir = path.join(__dirname, '../../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`✅ Logging channel has been set to ${channel}`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
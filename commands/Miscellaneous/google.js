const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'google',
    aliases: ['search'],
    description: 'Search Google and get instant results',
    usage: '.google <search query>',
    category: 'Miscellaneous',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('What would you like to search for?');
        }

        const query = args.join(' ');
        const apiKey = process.env.GOOGLE_API_KEY;
        const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(searchUrl);
            const results = response.data.items.slice(0, 5);

            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setTitle(`🔍 Search Results for: ${query}`)
                .setDescription(
                    results.map((item, index) => {
                        return `**${index + 1}. [${item.title}](${item.link})**\n${item.snippet}\n`;
                    }).join('\n')
                )
                .setFooter({ 
                    text: `Requested by ${message.author.tag}`, 
                    iconURL: message.author.displayAvatarURL() 
                })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('Looks like the search engine needs a tune-up! Try again later! 🔧');
        }
    }
};

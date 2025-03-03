const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: 'Shows all available commands or info about a specific command',
    usage: '.help [command]',
    category: 'General',
    execute(message, args) {
        const { commands } = message.client;

        // If a command name is provided, show specific command help
        if (args.length > 0) {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) {
                return message.reply('That command does not exist!');
            }

            const commandEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setTitle(`Command: ${command.name}`)
                .addFields(
                    { name: 'Description', value: command.description || 'No description available' },
                    { name: 'Usage', value: command.usage || `.${command.name}` },
                    { name: 'Category', value: command.category || 'Uncategorized' }
                )
                .setFooter({ 
                    text: `Requested by ${message.author.tag}`, 
                    iconURL: message.author.displayAvatarURL() 
                })
                .setTimestamp();

            if (command.aliases) {
                commandEmbed.addFields({ name: 'Aliases', value: command.aliases.join(', ') });
            }

            return message.reply({ embeds: [commandEmbed] });
        }

        // Categories setup
        const categories = {
            Moderation: new Set(),
            General: new Set()
        };

        commands.forEach(cmd => {
            if (cmd.category === 'Moderation') {
                categories.Moderation.add(cmd.name);
            } else if (cmd.category === 'General') {
                categories.General.add(cmd.name);
            }
        });

        Object.keys(categories).forEach(key => {
            categories[key] = Array.from(categories[key]);
        });

        const mainEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setAuthor({ 
                name: 'Command Help Menu', 
                iconURL: message.client.user.displayAvatarURL() 
            })
            .setDescription('Welcome to the help menu! Here you can find all available commands.')
            .addFields(
                { 
                    name: 'Vital', 
                    value: '\n**#1 versatile discord bot for your servers aesthetic using moderation/fun and much more\n**' 
                },
                {
                    name: '💡 How to Use',
                    value: '```\nSelect a category from the dropdown menu below to view its commands.\nOr use .help [command] for specific command info.\n```'
                },
                {
                    name: '🔍 Quick Info',
                    value: '```\nPrefix: .\nExample: .help or .help ping\n```'
                },
                {
                    name: 'Support',
                    value: '\nhttps://discord.gg/vitalrocks'
                }
            )
            .setFooter({ 
                text: `Requested by ${message.author.tag}`, 
                iconURL: message.author.displayAvatarURL() 
            })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help-menu')
                    .setPlaceholder('Select a category')
                    .addOptions([
                        {
                            label: 'Moderation',
                            description: 'View moderation commands',
                            value: 'moderation',
                            emoji: '🛡️'
                        },
                        {
                            label: 'General',
                            description: 'View general commands',
                            value: 'general',
                            emoji: '⚙️'
                        }
                    ])
            );

        message.reply({ embeds: [mainEmbed], components: [row] })
            .then(msg => {
                const collector = msg.createMessageComponentCollector({ time: 60000 });

                collector.on('collect', async i => {
                    if (i.user.id !== message.author.id) {
                        return i.reply({ content: 'This menu is not for you!', ephemeral: true });
                    }

                    const selectedCategory = i.values[0];
                    const categoryName = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
                    const categoryCommands = categories[categoryName];

                    const categoryEmbed = new EmbedBuilder()
                        .setColor(0x000000)
                        .setAuthor({ 
                            name: `${categoryName} Commands`, 
                            iconURL: message.client.user.displayAvatarURL() 
                        })
                        .setDescription(
                            categoryCommands.map(cmdName => {
                                const cmd = commands.get(cmdName);
                                return `### ${cmd.usage || `.${cmd.name}`}\n> ${cmd.description || 'No description available'}\n`;
                            }).join('\n') || 'No commands in this category'
                        )
                        .setFooter({ 
                            text: `Requested by ${message.author.tag}`, 
                            iconURL: message.author.displayAvatarURL() 
                        })
                        .setTimestamp();

                    await i.update({ embeds: [categoryEmbed], components: [row] });
                });

                collector.on('end', () => {
                    msg.edit({ components: [] }).catch(() => {});
                });
            });
    }
};
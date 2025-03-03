const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
require('./webhooks/github')(client);

// Enhanced Command Handler for Subfolders
const loadCommands = (dir) => {
  const folders = fs.readdirSync(dir);

  for (const folder of folders) {
    const folderPath = path.join(dir, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      command.category = folder; // Automatically set category based on folder name
      client.commands.set(command.name, command);
      
      // Handle aliases if they exist
      if (command.aliases) {
        command.aliases.forEach(alias => {
          client.commands.set(alias, command);
        });
      }
    }
  }
};

// Load commands from subfolders
loadCommands(path.join(__dirname, 'commands'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle('Command Usage')
      .setDescription(`Example: \`.ping\`\nPrefix: .\n\nUse \`.help\` for command list`)
      .setTimestamp();

    message.reply({ embeds: [embed] });
    return;
  }

  if (!message.content.startsWith('.')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!');
  }
});

client.login(process.env.DISCORD_TOKEN);
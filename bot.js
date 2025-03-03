const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

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

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const loadCommands = (dir) => {
  const folders = fs.readdirSync(dir);

  for (const folder of folders) {
    const folderPath = path.join(dir, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      command.category = folder;
      client.commands.set(command.name, command);
      
      if (command.aliases) {
        command.aliases.forEach(alias => {
          client.commands.set(alias, command);
        });
      }
    }
  }
};

loadCommands(path.join(__dirname, 'commands'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('.help | /vitalrocks', { type: ActivityType.Watching });
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.mentions.users.size === 1 && message.mentions.users.has(client.user.id) && !message.reference) {
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

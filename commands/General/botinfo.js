const { EmbedBuilder } = require('discord.js');
const os = require('os');
const fs = require('fs');
const path = require('path');

function getCodeStats(dir) {
    let stats = {
        lines: 0,
        files: 0
    };

    function processFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const codeLines = content.split('\n')
            .filter(line => line.trim() && !line.trim().startsWith('//'))
            .length;
        stats.lines += codeLines;
        stats.files += 1;
    }

    function walkDir(currentPath) {
        try {
            const files = fs.readdirSync(currentPath);
            files.forEach(file => {
                const filePath = path.join(currentPath, file);
                if (file === 'node_modules' || file === '.git') return;
                
                if (fs.statSync(filePath).isDirectory()) {
                    walkDir(filePath);
                } else if (file.endsWith('.js')) {
                    processFile(filePath);
                }
            });
        } catch (error) {
            console.log('Directory read error:', error);
        }
    }

    walkDir(dir);
    return stats;
}

module.exports = {
    name: 'botinfo',
    aliases: ['bi'],
    description: 'Shows detailed information about the bot',
    usage: '.botinfo',
    category: 'General',
    execute(message) {
        // Get CPU usage
        const cpuUsage = os.loadavg()[0];
        const cpuPercent = (cpuUsage * 100 || 0).toFixed(1);
        
        // Get disk usage
        const diskUsage = {
            free: 0,
            percent: 0
        };
        
        try {
            const disk = os.freemem();
            const total = os.totalmem();
            diskUsage.free = Math.floor(disk / 1024 / 1024 / 1024);
            diskUsage.percent = ((1 - disk / total) * 100).toFixed(1);
        } catch (error) {
            console.log('Disk stats error:', error);
        }

        const client = message.client;
        
        const embed = new EmbedBuilder()
            .setTitle('Vital')
            .setDescription('[**invite**](https://discord.com/oauth2/authorize?client_id=1333449703165005845&permissions=8&integration_type=0&scope=bot)')
            .addFields(
                { 
                    name: '__Client__', 
                    value: `> **Latency**: ${Math.abs(client.ws.ping)}ms\n> **CPU**: ${cpuPercent}%\n> **DISK**: ${diskUsage.percent}%(${diskUsage.free}GB free)\n> **Guilds**: ${client.guilds.cache.size}`,
                    inline: false 
                },
                { 
                    name: '__Statistics__', 
                    value: `> **Users**: ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\n> **Channels**: ${client.channels.cache.size}\n> **Roles**: ${client.guilds.cache.reduce((acc, guild) => acc + guild.roles.cache.size, 0)}`,
                    inline: false 
                },
                { 
                    name: '__Code__', 
                    value: `> **Lines**: ${getCodeStats(path.join(__dirname, '../../')).lines}\n> **Files**: ${getCodeStats(path.join(__dirname, '../../')).files}`,
                    inline: false 
                }
            )
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};

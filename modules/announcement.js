const fs = require('fs');
const csv = require('csv-parser');
const Discord = require("discord.js");
const {
    Client,
    IntentsBitField,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");



require("dotenv").config();
module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        const channel = await client.channels.fetch(process.env.ANNOUNCEMENT_ID);
        // Ignore messages from the bot itself
        if (message.author.bot) return;
    
        // Check if the message starts with *KUCC
        if (message.content.startsWith('*KUCC ')) {
            // Check if the author has the "moderator" role
            const moderatorRole = message.guild.roles.cache.find(role => role.name === 'moderators');
            if (!moderatorRole || !message.member.roles.cache.has(moderatorRole.id)) {
                const reply = await message.reply('You do not have the necessary role to use this command.');
                setTimeout(() => reply.delete(), 5000); // Delete reply after 5 seconds
                return;
            }
    
            // Extract the text after *KUCC
            const kuccText = message.content.slice(6).trim();
            await channel.send({
                content: kuccText,
                
              });
              
              // Do something with the text
              
              
              // Respond to the message and delete the response after a delay
              const reply = await message.reply(`You triggered the KUCC command with: ${kuccText}`);
              setTimeout(() => reply.delete(), 5000); // Delete reply after 5 seconds
              
        }
    });

};

const fs = require('fs');

const path = require('path');

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
    Colors,
    PermissionFlagsBits,
    
} = require("discord.js");
let customemoji=false
function appendToCSV(filePath, data) {
    // Ensure the file path is absolute
    const absolutePath = path.resolve(filePath);

    // Append data to the file
    fs.appendFile(absolutePath, data + '\n', 'utf8', (err) => {
        if (err) {
            console.error('Error appending data to the file:', err);
        } 
    });
}
module.exports = async (interaction) => {
    let roleemoji=''
    const newrole = interaction.options.get('role_name').value;
    const roleemojifull=interaction.options.get('role_emoji').value;
    if(roleemojifull.includes(":")){
         customemoji=true
        roleemoji=roleemojifull.split(':')[1]
    }else{
         customemoji=false
        roleemoji=roleemojifull
    }
    const modRole = interaction.guild.roles.cache.find(
        (role) => role.name === "Moderator"
    );
    
        // Create the new role
       
        const newRole = await interaction.guild.roles.create({
            name: newrole,
            color: Colors.Blue, // You can specify a color or remove this line
            reason: 'New role created for specific permissions',
        });

        // Create a category with the role name
        const category = await interaction.guild.channels.create({
            name: newrole+" Community",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: PermissionFlagsBits.ViewChannel,
                },
                {
                    id: newRole.id,
                    allow: PermissionFlagsBits.ViewChannel,
                },
            ],
        });

        // Create a text channel under the new category
        const notices = await interaction.guild.channels.create({
            name: `📔Notices`,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny:PermissionFlagsBits.ViewChannel,
                },
                {
                    id: newRole.id,
                    allow:PermissionFlagsBits.ViewChannel,
                },  {
                    id: modRole.id,
                    allow:PermissionFlagsBits.ViewChannel,
                },
            ],
        });
        const  generalchat= await interaction.guild.channels.create({
            name: `💬General Chat`,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny:PermissionFlagsBits.ViewChannel,
                },
                {
                    id: newRole.id,
                    allow:PermissionFlagsBits.ViewChannel,
                },  {
                    id: modRole.id,
                    allow:PermissionFlagsBits.ViewChannel,
                },
            ],
        });
        const  helpchat= await interaction.guild.channels.create({
            name: `🤝🏻-help`,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny:PermissionFlagsBits.ViewChannel,
                },
                {
                    id: newRole.id,
                    allow:PermissionFlagsBits.ViewChannel,
                },  {
                    id: modRole.id,
                    allow:PermissionFlagsBits.ViewChannel,
                },
            ],
        });
        const  resourceschat= await interaction.guild.channels.create({
            name: `💻-resources`,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny:PermissionFlagsBits.ViewChannel,
                },
                {
                    id: newRole.id,
                    allow:PermissionFlagsBits.ViewChannel,
                },  {
                    id: modRole.id,
                    allow:PermissionFlagsBits.ViewChannel,
                },
            ],
        });

        // Create a voice channel under the new category
        const voiceChannel = await interaction.guild.channels.create({
            name: `🎤VC`,
            type: ChannelType.GuildVoice,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny:PermissionFlagsBits.ViewChannel,
                },
                {
                    id: newRole.id,
                    allow: PermissionFlagsBits.ViewChannel,
                },
            ],
        });
        const channel = interaction.guild.channels.cache.get(process.env.ReactRole);

        const messageold = await channel.messages.fetch(process.env.RoleMessageId);
        if (customemoji) {
            try {
                const emojis = await interaction.guild.emojis.fetch();
                const newemoji = emojis.find(e => e.name === roleemoji);
        
                if (newemoji) {
                    roleemoji = newemoji;
                } else {
                    console.error(`Emoji with name ${roleemoji} not found.`);
                    return; // Exit if the emoji is not found
                }
            } catch (error) {
                console.error(`Failed to fetch emojis: ${error}`);
                return; // Exit if there is an error fetching emojis
            }
        }
        await messageold.react(roleemoji.id ? `<:${roleemoji.name}:${roleemoji.id}>` : roleemoji);
        // messageold.react(roleemoji)
        if(customemoji){
           
           roleemoji=roleemojifull.split(':')[1]
        }
      

        appendToCSV("./csv/roles.csv",[roleemoji,newRole.id])
    }
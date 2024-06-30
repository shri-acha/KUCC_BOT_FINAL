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

const createchannels=require("./submodules/channelcreation.js")

module.exports = async (interaction) => {
    try{
    //previlage check
    const newrole = interaction.options.get('role_name').value;
    const modRole = interaction.guild.roles.cache.find(
        (role) => role.name === "moderators"
    );
    const hasrole = interaction.member.roles.cache.has(modRole.id);

    if (!hasrole) {
        await interaction.reply({
            content: "Not enough privilege to use this command",
            ephemeral: true,
        });
        return;
    }

    //check if role exists
    const mentioned = interaction.guild.roles.cache.find(
        (role) => role.name == newrole
    );

    if (mentioned) {
        await interaction.reply({
            content: "Role Already Exists",
            ephemeral: true,
        });
        return;
    }

    //if not exists now create 
        createchannels(interaction);

        await interaction.reply({
            content: `Role ${newrole} and associated channels created successfully.`,
            ephemeral: true,
        });

    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "An error occurred while creating the role or channels.",
            ephemeral: true,
        });
    }
};

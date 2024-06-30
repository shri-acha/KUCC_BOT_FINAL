const fs = require('fs');
const csv = require('csv-parser');

let rolemoji=''
require('dotenv').config();
const {
  Client,
  IntentsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  
} = require('discord.js');
function containsEmoji(str) {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\u200D[\p{Emoji}]+|\p{Emoji})(\uFE0F|\u20E3)?/gu;
  return emojiRegex.test(str);
}
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});


async function readCSVAndPopulateArrays(filePath) {
  let IDs = [];
  let LABELS = [];
  let roles = [];

  return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
              const [LABEL, ID] = Object.values(data);
              LABELS.push(LABEL);
              IDs.push(ID);
          })
          .on('end', () => {
              for (let i = 0; i < IDs.length; i++) {
                  roles.push({
                      id: IDs[i],
                      label: LABELS[i]
                  });
              }
              
              resolve(roles);
          })
          .on('error', (error) => {
              reject(error);
          });
  });
}






client.on('ready', async (c) => {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    roles=await readCSVAndPopulateArrays("./csv/roles.csv")
    statusrole=await readCSVAndPopulateArrays("./csv/status.csv")
    
    const channel = await client.channels.cache.get(process.env.ReactRole);
    if (!channel) return;
    var welcomeMessage = `React below to get access to the specific communities.Choose as many Communities as you would like to be a part of
    _____________________________________________________________________________`;
    var StatusMessage=`React According to your current status in KU
   
    ____________________________________________________________________________`

    
    const statusmessaage=await channel.send({
      content: StatusMessage,
      
    });
    for (let i = 0; i < statusrole.length; i++) {
      rolemoji=statusrole[i].label
      
     if(!containsEmoji(rolemoji)){
      const emojis = await guild.emojis.fetch();
      
      const newemoji = emojis.find(e => e.name === rolemoji);
      rolemoji=newemoji
     }
     
     await statusmessaage.react(rolemoji.id ? `<:${rolemoji.name}:${rolemoji.id}>` : rolemoji);
    }

    

    const message=await channel.send({
      content: welcomeMessage,
      
    });

    
   
    
    for (let i = 0; i < roles.length; i++) {
      rolemoji=roles[i].label
      
     if(!containsEmoji(rolemoji)){
      const emojis = await guild.emojis.fetch();
      
      const newemoji = emojis.find(e => e.name === rolemoji);
      rolemoji=newemoji
     }
     
     await message.react(rolemoji.id ? `<:${rolemoji.name}:${rolemoji.id}>` : rolemoji);
    }
    process.exit();
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);
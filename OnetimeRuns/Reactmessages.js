const fs = require('fs');
const csv = require('csv-parser');
let IDs = [];
let LABELS = [];
let roles=[];
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


function readCSVAndPopulateArrays(filePath) {
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
        id:IDs[i],
        label:LABELS[i]
        
      })
    }
    
    
  });
  
}

readCSVAndPopulateArrays("./csv/roles.csv")




client.on('ready', async (c) => {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    
    
    const channel = await client.channels.cache.get(process.env.ReactRole);
    if (!channel) return;
    var welcomeMessage = `React to the roles relative to you to gain access to different parts of the server 

    Select according to your current status
    ——————————————————————————————
    KU Student - 
    KU Alumni - 
    Working - 
    Out Student - 
    ——————————————————————————————`;

    

    

    const message=await channel.send({
      content: welcomeMessage,
      
    });

    const filePath = "./csv/reactmessage.txt";
    fs.writeFileSync(filePath, `${message.id}\n`, function(err) {
      if (err) throw err;
      
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
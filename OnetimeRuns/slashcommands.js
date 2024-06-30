require('dotenv').config();
const { REST, Routes,ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'createrole',
    description: 'create a new role along with the needed channel(Admin Level Only)',
    options:[
      {
        name:'role_name',
        description:'name of the role',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'role_emoji',
        description: 'emoji for the role',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
     
     
    ]
  },
  


 
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
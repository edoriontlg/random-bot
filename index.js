const Discord = require('discord.js');
const client = new Discord.Client();

//When the bot is connected
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot ID is ${client.user.id}`)

    //Loads all users so our bot can find users at random
    cacheUsers();
});

//Recache users whenever a guild is added/deleted, same for users.
client.on('guildBanAdd', cacheUsers);
client.on('guildBanRemove', cacheUsers);
client.on('guildUpdate', cacheUsers);
client.on('guildMemberAdd', cacheUsers);
client.on('guildMemberRemove', cacheUsers);
client.on('guildMemberUpdate', cacheUsers);

//When a message is received, checks if it contains random's name
client.on('message', msg => {
    if (msg.content.includes(`${client.user.id}`)) {

        console('Log random mention detected');

        //Get a random user from the server's cache
        userToMention = msg.guild.members.cache.random().user;

        //Checks if it wont mentions itself
        while (userToMention.id == client.user.id) {
            console.log('Mentionned itself, oops');
            userToMention = msg.guild.members.cache.random().user;
        }


        msg.channel.send(generateMention(msg.author, userToMention));
    }
});

client.login(process.env.TOKEN);

//Return a message from a template
function generateMention(author, user) {
    templates = [
        `${author} mentionned ${user} at random !`,
        `${author} randomly tagged ${user}, idk why`,
        `${author} mentionned ${user} at random ! You're so lucky 🤩`,
        `I mentionned ${user} because ${author} asked it. Sorry !`,
        `${author} sends his Pikachu. ${user}, I choose you ! 😎`,
        `${author} asked for help, and you, ${user} were chosen ! 🌟`,
        `${author} asked for me but I'm too lazy to help him, can you do it ${user} ?`,
        `*pssss ${user}, I think ${author} wants you. maybe someone else, idk but you're the first one I thought about.*`,
    ]

    var randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
}

//Self explanatory
function cacheUsers(event) {
    client.guilds.cache.forEach(element => {
        element.members.fetch().then(console.log(`Members cached for guild ${element.name}`))
    });
}
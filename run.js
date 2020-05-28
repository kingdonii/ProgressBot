const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const prettyMilliseconds = require('pretty-ms');
const client = new Discord.Client();
const Sequelize = require('sequelize');
const helpembed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle('Commands')
.addFields(
    { name: '!started', value: 'Marks today as the date at which you started' },
    { name: '!startedfor', value: `Marks the day at which you started (example : !startedfor 15 days)` },
    { name: '!progress', value: `Shows you how long you've been going so far!`},
    { name: '!reset', value: 'Resets your progress to today' },
    { name: '!wipe', value: 'Deletes your progress entirely' },
);
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
}); 
const progtable = sequelize.define('progtable', {
	username: Sequelize.STRING,
	progtime: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
        allowNull: false,
    
    },

});
client.once('ready', () => {
    console.log('Ready!');
    progtable.sync();
});
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
if (command === 'help' ){  
        message.channel.send(helpembed);
        }
else if (command === `started`) {
       var timenow = new Date(message.createdAt);
       var timenowms = timenow.getTime();
       try {
        const prog = await progtable.create({
            username: message.author.username,
            progtime: timenowms,
        });
        return message.reply(`Well Done! Keep it up!`);
    }
finally{}
  }
else if (command === `startedfor`) {

if (!args.length) {
    return message.channel.send(`You didn't provide a period, ${message.author}!`);
    }
else {
var current = new Date(message.createdAt);
var didntdays = parseInt(args[0]);

var didntms = didntdays * 86400000;
var didntyikes = current.getTime() - didntms;
try {
	const progg = await progtable.create({
        username: message.author.username,
        progtime: didntyikes,
	});
}
finally{}
return message.reply(`Well Done! Keep it up!`);
}
  }
if (command === 'reset') {
    var timees = new Date(message.createdAt);
    var timeess = timees.getTime();
    const proggg = await progtable.update({ progtime: timeess }, { where: { username: message.author.username } });
    }
    if (command === 'wipe'){

        const SEEKANDDESTROY = await progtable.destroy({ where: { username: message.author.username } });
       return message.reply('Your progress has been reset.');
    }
if (command === 'progress') {
    const tag = await progtable.findOne({ where: { username: message.author.username } });
    var dateee = message.createdAt;
    var progtimee = tag.get('progtime');
    var elapsedd = dateee.getTime() - progtimee;
    let resultt = prettyMilliseconds(elapsedd, {verbose: true});
      return message.reply(`You've been at it for ` + resultt + `!`);
    
    }


  
});
client.login(token);
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
const music = require('discord.js-music-v11')
music(client, {
	prefix: ${config.prefix}        // Prefix of '-'.
	global: false,      // Server-specific queues.
	maxQueueSize: 100,   // Maximum queue size of 10.
	clearInvoker: false, // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix)
    channel: ''    // Name of voice channel to join. If omitted, will instead join user's voice channel.
  });

function Role(mem, role) {
  return mem.roles.some(r=> r.name.toLowerCase() === role.toLowerCase());
  }

function clean(text) {
  if(typeof(text) === "string")
  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, + String.fromCharCode(8203));
  else
    return text;
}

function uptime() {
    var date = new Date(client.uptime);
    var strDate = '';
    strDate += date.getUTCDate() - 1 + " days, ";
    strDate += date.getUTCHours() + " hours, ";
    strDate += date.getUTCMinutes() + " minutes, ";
    strDate += date.getUTCSeconds() + " seconds";
    return strDate;
}


client.on('ready', () => {
  console.log(`Ready to begin serving in `  + client.guilds.size + ` servers!`);
   client.user.setPresence({ game: { name: client.guilds.size + ' servers | ' + config.prefix + 'help', type: 0 } });
});

client.on("disconnected", function () {
	console.log("Disconnected!");
});

client.on('guildCreate', guild => {
	   client.user.setPresence({ game: { name: client.guilds.size + ' servers | ' + config.prefix + 'help', type: 0 } });
console.log(`I have joined a new server! :D, named \`${guild.name}\` with \`${guild.members.filter(u => u.user.bot === false).size}\` members and \`${guild.members.filter(m=>m.user.bot).size -1}\` other bots, now in \`${client.guilds.size}\` servers!`)
client.channels.get('357242204051341312').send(`I have joined a new server! :D, named \`${guild.name}\` with \`${guild.members.filter(u => u.user.bot === false).size}\` members and \`${guild.members.filter(m=>m.user.bot).size -1}\` other bot(s), now in \`${client.guilds.size}\` servers!`)
});

client.on('guildDelete', guild => {
	   client.user.setPresence({ game: { name: client.guilds.size + ' servers | ' + config.prefix + 'help', type: 0 } });
client.channels.get('357242204051341312').send(`I have left a server! :( named \`${guild.name}\`, now in \`${client.guilds.size}\` servers.`);
console.log(`I have left a server! :( named \`${guild.name}\`, now in \`${client.guilds.size}\` servers.`)
});
client.on('message', message => {
  var args = message.content.split(/[ ]/)
  if(message.author.bot) return;

  var command = message.content.split(" ")[0];
 command = command.toLowerCase().slice(config.prefix.length);

if(!message.content.startsWith(config.prefix)) return;

if(command === "leaveserver") {
	if(message.author.id !== config.owner || message.author.id !== message.guild.ownerID) return;
	message.guild.leave().then(g => {
		client.channels.get('357242204051341312').send(`left server ${g.name}, now in ${client.guilds.size} servers`)
	})
}

if(command === "eval") {
	if(message.author.id !== config.owner) return;
	try {
	const code = args.slice(1).join(" ")
	let evaled = eval(code);

	if (typeof evaled !== "string")
		evaled = require("util").inspect(evaled);

	message.channel.send(clean(evaled), {code:"xl"});
} catch (err) {
	message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
}
};

if(command === 'serverinfo') {
    message.channel.send({
        embed: {
            color: 3447003,
            author: {
                name: `${message.guild.name}`,
                icon_url: message.guild.iconURL
            },
            "thumbnail": {
                "url": `${message.guild.iconURL}`
            },
            fields: [{
                    name: "Guild Owner",
                    value: `${message.guild.owner}`
                },
                {
                    name: "Total Amount of Members",
                    value: `${message.guild.members.filter(u => u.user.bot === false).size} Members and ${message.guild.members.filter(m=>m.user.bot).size} bots`
                },
                {
                    name: "Date of the Guild was Created",
                    value: `${message.guild.createdAt.toLocaleString()}`
                },
                {
                    name: "Server Region",
                    value: `${message.guild.region}`
                },
    {
  name: "Number of Roles",
  value: `${message.guild.roles.size} roles`
    }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: message.author.avatarURL,
                text: `${message.guild.name} is kewl`
            }
        }
    })
};

if(command === "members") {
	message.channel.send(message.guild.members.filter(u => u.user.bot === false).size)
} else

if(command === 'mute') {

  var reason = args.slice(2).join(' ');
  var user = message.mentions.users.first();
  var modlog = client.guilds.get(message.guild.id).channels.find('name', 'mod-logs');
  var muteRole = client.guilds.get(message.guild.id).roles.find('name', 'muted');
  if (!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
  if (!muteRole) return message.reply('I cannot find a mute role (please make a role named `muted` with only 2 permissions, read messages and read message history.)').catch(console.error);
  if (reason.length < 1) return message.reply('You must supply a reason for the mute.').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);
  if (message.guild.member(user).roles.has(muteRole.id)) return message.channel.send('That person is already muted ya ejit')
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Mute\n**Target:** ${user}\n**Moderator:** ${message.author}\n**Reason:** ${reason}`);
message.channel.send('**__User successfully muted__**');

    message.guild.member(user).addRole(muteRole).then(() => {
      client.channels.get(modlog.id).send({embed}).catch(console.error);
    })
};

if(command === "unmute") {
  var user = message.mentions.users.first();
  var modlog = client.guilds.get(message.guild.id).channels.find('name', 'mod-logs');
  var muteRole = client.guilds.get(message.guild.id).roles.find('name', 'muted');
  if (!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Unmute\n**Target** ${user}\n**Moderator** ${message.author}\n**Guild** ${message.guild.name}`);

  if (message.guild.member(user).roles.has(muteRole.id)) {
    message.guild.member(user).removeRole(muteRole).then(() => {
      client.channels.get(modlog.id).send({embed}).catch(console.error);
      message.channel.send(`Successfully unmuted ${user}!`)
    });
  } else {
    message.channel.send('That user isnt muted ya pleb.')
  }
} else

if(command === "removerole") {
	if (!message.member.hasPermission('MANAGE_ROLES') && message.author.id != config.owner) return message.channel.send('Nah fam, go get the right permissions then i will. (Manage Roles)')
	var user = message.mentions.users.first();
	var modlog = client.channels.find('name', 'member-log');
	  if (!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
	var name = args.slice(2).join(" ")
	var role = client.guilds.get(message.guild.id).roles.find('name', name);
	if(!role) return message.reply('You didnt specify a role to remove, please specify one')
	if(!user) return message.reply('You didnt specify a user, please specify one')
	message.guild.member(user).removeRole(role).then(() =>{
		message.channel.send(`Successfully taken ${role.name} fron ${user}!`)
	})
}

if(command === "addrole") {
	if (!message.member.hasPermission('MANAGE_ROLES') && message.author.id != config.owner) return message.channel.send('Nah fam, go get the right permissions then i will. (Manage Roles)')
  var user = message.mentions.users.first();
	  if (!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
  var modlog = client.channels.find('name', 'member-log');
  var name = args.slice(2).join(" ")
  var role = client.guilds.get(message.guild.id).roles.find('name', name);
  if(!role) return message.reply('You didnt specify a role to add, please specify one')
  if(!user) return message.reply('You didnt specify a user, please specify one')
  message.guild.member(user).addRole(role).then(() =>{
    message.channel.send(`Successfully added ${role.name} to ${user}!`)
  })
}

if(command === "setgame") {
  var game = args.slice(1).join(" ")
  if(!game) return client.user.setPresence({ game: { name: client.guilds.size + ' servers | ' + config.prefix + 'help', type: 0 } });
     client.user.setPresence({ game: { name: game, type: 0 } });
}

if(command === "status") {
  var status = args.slice(1).join(" ")
  client.user.setStatus(status)
}

if(command === "nickname") {
  var name = args.slice(2).join(" ")
  var user = message.mentions.users.first()
  if(!user) return message.reply('Whose name am i changing?')
  if(!name) return message.reply('What am i changing that users name to?')
  message.guild.member(user).setNickname(name)
  message.reply('Done!')
}


if(command === "order") {
  var order = args.slice(1).join(' ')
  var user = message.author.username
  var guild = message.guild.name
  if(!order) return message.channel.send('What is your order?');

  message.channel.send(`The Kitchen has recieved your order ${order}, they will make it soon (check your DMs)`)
  client.channels.get('350583815627997184').send(`We have recieved a new order from ${user}, \`${order}\` in ${guild} (${message.author.id}) (${message.author.username}#${message.author.discriminator})`)
  message.author.send(`We have recieved your order, Someone will Direct Message you with your ${order} soon!`)
} else

if(command === "serve") {
  if(message.content.length > 5 + config.prefix.length) return;
  var response = args.slice(2).join(' ')
  var user = message.author.username
  var mention = message.mentions.users.first()
  if(!response) return message.channel.send('What is your response?');

client.channels.get('350766799974957078').send(`Yo ${mention}, Heres your food ${response}`)
message.channel.send(`I have sent your response (${response}) to The Dining Room`)
}

if(command === 'purge') {
  if(args[0].length > 6 + config.prefix.length) return;
	  if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id !== config.owner) return message.channel.send('Sorry, you dont have the right permissions (Manage Messages), i cant help you bro')
    if(args.slice(1).length < 1) {
      message.channel.send('How many messages do you want me to delete?').catch(console.error);
    } else {
      if(args.slice(1) === "0") {
        message.channel.send('I\'m sorry, i cant do that, try again, (max messages 99)').catch(console.error);
      } else {
      if(args[1].length >= 3) {
        message.channel.send('Whoaaaaaaaaaaaaaaaah, too many bro, the most i can delete is 99, and if the messages are over 2 weeks old, better go get some coffee, i cant delete them').catch(console.error);
      } else {
        var msg;
        if(args.length === 1) {
            msg=2;
        } else {
          msg=parseInt(args[1]) + 1;
        }
        message.channel.fetchMessages({limit: msg}).then(messages => {
          if(messages.size <= 1) return;
          message.channel.bulkDelete(messages)}).catch(console.log).then(() => {
				message.channel.send(`${msg -1} message(s) deleted`).then(m => {
					m.delete(5000)
				})});
      }
    }
  }
} else

if(command === 'prune') {
  if(args[0].length > 6 + config.prefix.length) return;
	  if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id !== config.owner) return message.channel.send('Sorry, you dont have the right permissions (Manage Messages), i cant help you bro')
    if(args.slice(1).length < 1) {
      message.channel.send('How many messages do you want me to delete?').catch(console.error);
    } else {
      if(args.slice(1) === "0") {
        message.channel.send('I\'m sorry, i cant do that, try again, (max messages 99)').catch(console.error);
      } else {
      if(args[1].length >= 3) {
        message.channel.send('Whoaaaaaaaaaaaaaaaah, too many bro, the most i can delete is 99, and if the messages are over 2 weeks old, better go get some coffee, i cant delete them').catch(console.error);
      } else {
        var msg;
        if(args.length === 1) {
            msg=2;
        } else {
          msg=parseInt(args[1]) + 1;
        }
        message.channel.fetchMessages({limit: msg}).then(messages => {
          if(messages.size <= 1) return;
          message.channel.bulkDelete(messages)}).catch(console.log).then(() => {
				message.channel.send(`${msg -1} message(s) deleted`).then(m => {
					m.delete(5000)
				})});
      }
    }
  }
} else

if(command === "nuke") {
  if(message.content.length > 4 + config.prefix.length) return;
  message.channel.send("OH GOD, THERES A NUKE COMIN, GET OUTTA HERE!")
  message.delete()
} else

if(command === 'vi') {
  if(message.content.length > 2 + config.prefix.length) return;
  message.channel.send('Your nickname could not be changed on this server.').catch(console.error);
} else

if(command === "explode") {
  if(message.content.length > 7 + config.prefix.length) return;
  message.channel.send(":boom: :boom: :boom: :boom: :boom: :boom: THE NUKE EXPLODED, ANYONE STILL IN HERE IS DEAD")
  message.delete()
} else

if(command === "ban") {
  var user = message.mentions.users.first()
  var author = message.author
	var modlog = message.guild.channels.find('name', 'mod-logs');
  if (!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
  var role = (message.member.hasPermission('BAN_MEMBERS') && message.author.id !== config.owner);
  var banMember = message.guild.member(message.mentions.users.first());
	var reason = args.slice(2).join(" ")
	if(!reason) return message.channel.send('Why are you banning that user?')
  if(!banMember)
  return message.channel.send('That user is not Valid');
  if (!message.member.hasPermission('BAN_MEMBERS') && message.author.id != config.owner)
  return message.channel.send("You don't have the permission Ban Members !");
  if (!user) return message.channel.send('Who do you want to ban?')
	const embed = new Discord.RichEmbed()
			 .setColor(0x00AE86)
			 .setTimestamp()
			 .setDescription(`**Action:** Ban\n**Target:** ${user}\n**Moderator:** ${author}\n**Reason:** ${reason}`);

			 client.channels.get(modlog.id).send({embed}).catch(console.error);
  banMember.send(`You have been banned from ${message.guild} by ${author} for ${reason}`)
  banMember.ban().then(member => {
    message.channel.send(`${user} got ban hammered by ${author}!`).catch(console.error);
  });
  }

if(command === "kick") {
    var user = message.mentions.users.first()
    var author = message.author
    var role = (message.member.hasPermission('KICK_MEMBERS') && message.author.id == config.owner);
		var reason = args.slice(2).join(" ")
		var modlog = message.guild.channels.find('name', 'mod-logs');
    var kickMember = message.guild.member(message.mentions.users.first());
		  if (!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
    if(!kickMember)
    return message.channel.send('That user is not Valid');
    if (!message.member.hasPermission('KICK_MEMBERS') && message.author.id == config.owner)
    return message.channel.send("You don't have the permission Kick Members !");
    if (!user) return message.channel.send('Who do you want to kick?')
		if(!reason) return message.channel.send('Why are you kicking that that person')
		const embed = new Discord.RichEmbed()
				 .setColor(0x00AE86)
				 .setTimestamp()
				 .setDescription(`**Action:** Kick\n**Target:** ${user}\n**Moderator:** ${author}\n**Reason:** ${reason}`);

				 client.channels.get(modlog.id).send({embed}).catch(console.error);
    kickMember.send(`You have been kicked from ${message.guild} by ${author} for ${reason}`)
    kickMember.kick().then(member => {
      message.channel.send(`${user} got kicked by ${author}!`).catch(console.error);
});
};

if(command === 'report') {
     if(args[0].length > 6 + config.prefix.length) return;
       if(args.length === 1) {
         message.channel.send('You did not define any arguments. Usage: `' + `${config.prefix}report <message>` + '`').catch(console.error);
       } else {
         if(args.slice(1).join(' ').length === 0) {
           message.channel.send('You have not given a message for my support team!. Usage: `' + `${config.prefix}report <message>` + '`').catch(console.error);
         } else {
           message.channel.send('I have sent the report ` ' + args.slice(1).join(' ') + ' ` to my support team!');
           client.channels.get('324723677461610497').send("<@&324721974590963716> we have a new report from " + message.member + ', ` ' + args.slice(1).join(' ') + ' ` good luck!').catch(console.error)
         }
        }
   } else

if(command === 'hug') {
     if(args[0].length > 4 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to hug. Usage: `' + `${config.prefix}hug <@User to hug>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to hug. Usage: `' + `${config.prefix}hug <@User to hug>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention a user to hug. Usage: `' + `${config.prefix}hug <@User to hug>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a user to hug. Usage: `' + `${config.prefix}hug <@User to hug>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(message.member.user + ' just hugged ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

if(command === 'stab') {
     if(args[0].length > 4 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
             return message.channel.send(message.member.user + ' just stabbed themselves :scream:').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to stab. Usage: `' + `${config.prefix}stab <@User to hug>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention a user to stab. Usage: `' + `${config.prefix}stab <@User to hug>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a user to stab. Usage: `' + `${config.prefix}stab <@User to hug>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':scream:' + message.member.user + ' just stabbed ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

if(command === 'shoot') {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to shoot. Usage: `' + `${config.prefix}shoot <@User to shoot>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to shoot. Usage: `' + `${config.prefix}shoot <@User to shoot>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention a user to shoot. Usage: `' + `${config.prefix}shoot <@User to shoot>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a user to shoot. Usage: `' + `${config.prefix}shoot <@User to shoot>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':scream:' + message.member.user + ' just :gun: shot ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

if(command === 'kiss') {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to kiss. Usage: `' + `${config.prefix}kiss <@User to kiss>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to kiss. Usage: `' + `${config.prefix}kiss <@User to kiss>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention a user to kiss. Usage: `' + `${config.prefix}kiss <@User to kiss>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a user to kiss. Usage: `' + `${config.prefix}kiss <@User to kiss>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':open_mouth: :kiss: ' + message.member.user + ' just kissed ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

if(command === 'sleep') {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to put to sleep. Usage: `' + `${config.prefix}sleep <@User to put to sleep>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to put to sleep. Usage: `' + `${config.prefix}sleep <@User to put to sleep>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention to put to sleep. Usage: `' + `${config.prefix}sleep <@User to put to sleep>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention to put to sleep. Usage: `' + `${config.prefix}sleep <@User to put to sleep>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':sleeping: ' + message.member.user + ' has put ' + message.mentions.users.first() + ' to sleep.');
         }
       }
       }
       }
   } else

if(command === 'revive') {
     if(args[0].length > 6 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to revive. Usage: `' + `${config.prefix}revive <@User to revive>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to revive. Usage: `' + `${config.prefix}revive <@User to revive>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention a user to revive. Usage: `' + `${config.prefix}revive <@User to revive>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a user to revive. Usage: `' + `${config.prefix}revive <@User to revive` + '`').catch(console.error);
           } else
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':smile: ' + message.member.user + ' has successfully revived ' + message.mentions.users.first());
         }
       }
       }
  } else

if(command === 'slap') {
    if(args[0].length > 6 + config.prefix.length) return;
      if(message.mentions.users.size === 0) {
        return message.channel.send('You did not Mention a user to slap. Usage: `' + `${config.prefix}slap <@User to slap>` + '`').catch(console.error);
      }
      if(message.mentions.users.size > 1) {
        return message.channel.send('You Mentioned too many users to slap. Usage: `' + `${config.prefix}slap <@User to slap>` + '`').catch(console.error);
      }
        if(!args[1].includes('@')) {
          return message.channel.send('You did not Mention a user to slap. Usage: `' + `${config.prefix}slap <@User to slap>` + '`').catch(console.error);
        } else {
          if(args[1].length <=1) {
            return message.channel.send('You did not Mention a user to slap. Usage: `' + `${config.prefix}slap <@User to slap` + '`').catch(console.error);
          } else
        if(args.slice(2).join(' ').length === 0) {
          {
          message.channel.send('rip, ' + message.member.user + ' just slapped ' + message.mentions.users.first() + '!');
        }
      }
      }
 } else

if(command === 'kill') {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to kill. Usage: `' + `${config.prefix}kill <@User to kill>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to kill. Usage: `' + `${config.prefix}kill <@User to kill>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention a user to kill. Usage: `' + `${config.prefix}kill <@User to kill>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a user to kill. Usage: `' + `${config.prefix}kill <@User to kill>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(':scream:' + message.member.user + ' just killed  ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

if(command === 'drunk') {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not mention the drunk user. Usage: `' + `${config.prefix}drunk <Drunk @user>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many drunk users. Usage: `' + `${config.prefix}drunk <Drunk @user>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention the drunk user. Usage: `' + `${config.prefix}drunk <Drunk @user>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a drunk user. Usage: `' + `${config.prefix}drunk <Drunk @user>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.send(message.member.user + ' suspects  ' + message.mentions.users.first() + ' is drunk.');
         }
       }
       }
       }
   } else

if(command === 'avatar') {
     if(args[0].length > 6 + config.prefix.length) return;
     if(message.mentions.users.size === 0) {
       return message.channel.send('You did not mention a user. Usage: `' + `${config.prefix}avatar <@user>` + '`').catch(console.error);
     }
     if(message.mentions.users.size > 1) {
       return message.channel.send('You Mentioned too many users. Usage: `' + `${config.prefix}avatar <@user>` + '`').catch(console.error);
     }
       if(!args[1].includes('@')) {
         return message.channel.send('You did not Mention a user. Usage: `' + `${config.prefix}avatar <@user>` + '`').catch(console.error);
       } else {
         if(args[1].length <=1) {
           return message.channel.send('You did not Mention a user. Usage: `' + `${config.prefix}avatar <@user>` + '`').catch(console.error);
         } else {
       if(args.slice(2).join(' ').length === 0) {
         {
         message.reply(message.mentions.users.first() + '\'s avatar is ' + message.mentions.users.first().displayAvatarURL);
       }
     }
     }
     }
 } else

if(command === 'mytime') {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.send(Date(client.uptime)).catch(console.error);
   } else

if(command === 'agree') {
     if(message.content.length > 5 + config.prefix.length) return;
     message.channel.send(message.member.user + ' has agreed to the rules and to stay active in this server. Timestamped: `' + (Date(client.uptime)) + '`');
   } else

if(command === 'hi') {
     if(message.content.length > 2 + config.prefix.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else

if(command === 'globalmembers') {
     if(message.content.length > 13 + config.prefix.length) return;
     message.channel.send(`I am used by ${client.guilds.reduce((p, c) => p + c.memberCount, 0)} people!`)
   }

if(command === 'hacker') {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.send(message.author.username + ' i dont see any hackers!').catch(console.error);
	  } else

/*
if(command === "name") {
   if(message.content.length > 4 + config.prefix.length) return;
	 if(message.author.id !== config.owner)
	 var name = args.slice(1).join(" ")
   client.user.setUsername(name)
   .then(user => console.log(`My new username is ${user.username}`))
   .catch(console.error);
 } else */

if(command === 'fire') {
     if(message.content.length > 4 + config.prefix.length) return;
     message.channel.send(':fire: :droplet: :fire_engine: :man:').catch(console.error);
   } else

if(command === 'restart') {
  if(message.content.length > 7 + config.prefix.length) return;
     if(message.author.id !== config.owner)
     return message.channel.send(`**Sorry! You\'re not the owner :P How did you find this command though? :thinking:\nBot Owner: The Doctor#5392**`);
     message.channel.send(`**Shutting Down! :wave:**`).then(() => process.exit(0));
     } else

if(command === 'rcm') {
     if(message.content.length > 3 + config.prefix.length) return;
     message.channel.send('**<@263334429106110465> is da best person to live**').catch(console.error);
   } else


if(command === 'oliver') {
        if(message.content.length > 6 + config.prefix.length) return;
        message.channel.send({embed: {
        color: 3447003,
        author: {
          name: message.author.user,
          icon_url: message.author.avatarURL
        },
        title: "Go follow this instagram",
        url: "https://imgpublic.com/user/the_iron_guitarist/1201876710/",
        description: "This Instagram is amazing",
        fields: [{
            name: "The link is...",
            value: "**https://imgpublic.com/user/the_iron_guitarist/1201876710/**"
          }],
            timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: message.author.username + " Wants to see The Iron Guitarist!"
        }
      }
    });
      }

if(command === 'info') {
    if(message.content.length > 4 + config.prefix.length) return;
  message.channel.send({embed: {
  author: {
    name: client.user.username,
    icon_url: client.user.avatarURL
  },
  color: 14147633,
fields: [{
name: 'Total Servers',
value: `I Am In ${client.guilds.size} Servers`,
inline: true
},
{
name: 'Total Users',
value: `${client.guilds.reduce((p, c) => p + c.memberCount, 0)} Users`,
inline: true
},
{
name: 'My Owner',
value: `<@224632668187394048>` ,
inline: true
},
{
name: 'Memory Usage',
value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
inline: true
},
{
name: 'Uptime',
value: uptime(),
inline: true
},
{
name: 'Library',
value: '[Discord.js](https://discord.js.org/#/)',
inline: true
},
{
name: "Ping time",
value: Math.round(client.ping),
inline: true
},
{
name: 'Creator Of This Command',
value: 'ᐯ ҉ᑭ ♆ Wolfie.js#4288',
inline: true
}]
}})};

   if(command === 'wakespy') {
   if(message.content.length > 7 + config.prefix.length) return;
     message.channel.send(message.member.user + ' just woke <@259876270215659522> up');
   } else

if(command === 'sinvite') {
     if(message.content.length > 7 +config.prefix.length) return;
     message.channel.send('I see you want an invite. Here is an invite ' + client.guild.fetchInvite() + ', enjoy!').catch(console.error);
   } else

if(command === 'hey') {
     if(message.content.length > 3 + config.prefix.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else

if(command === 'hallo') {
     if(message.content.length > 5 + config.prefix.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else


if(command === 'updates') {
     if(message.content.length > 7 + config.prefix.length) return;
     message.channel.send({embed: {
     color: 3447003,
     author: {
       name: message.author.user,
       icon_url: message.author.avatarURL
     },
     title: "Yes, i have been updated!",
     url: "https://discord.gg/ztezxDh",
     description: "Do you want to know what my updates are?",
     fields: [{
         name: "My updates are: ",
         value: "**most commands are now shown in an embed and i am getting some new commands, check ;;cmds to see them**"
       }],
         timestamp: new Date(),
     footer: {
       icon_url: message.author.avatarURL,
       text: message.author.username + " Wants to see my updates!"
     }
   }
 });
   }


if(command === 'myavatar') {
  if(message.content.length > 6 + config.prefix.length) return;
  message.channel.send("Your avatar is " + message.author.avatarURL).catch(console.error);
} else

if(command === 'tbomb') {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.send({embed: {
     color: 3447003,
     author: {
       name: message.author.user,
       icon_url: message.author.avatarURL
     },
     title: "You want to know who the best person in the world is?",
     url: "https://web.roblox.com/users/145689844/profile",
     description: "Are you sure?",
     fields: [{
         name: "**THE BEST PERSON IN THE WORLD IS**",
         value: "**therealtbomb! (<@235095550423334913>)**",
       }],
         timestamp: new Date(),
     footer: {
       icon_url: message.author.avatarURL,
       text: message.author.username + " Wants to know who the best person in the world is!"
     }
   }
 });
   }

   if(command === "warn") {
     if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id != config.owner) return message.channel.send('You do not have the correct permissions! ()');
     var user = message.mentions.users.first()
     var reason = args.slice(2).join(" ")
		 var modlog = client.guilds.get(message.guild.id).channels.find('name', 'mod-logs');
     var author = message.author.username
		   if (!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
     if(!user) return message.channel.send('Who are you warning?')
     if(!reason) return message.channel.send('Why are you warning ' + user + '?')
		 const embed = new Discord.RichEmbed()
			 .setColor(0x00AE86)
			 .setTimestamp()
			 .setDescription(`**Action:** Warn\n**Target:** ${user}\n**Moderator:** ${author}\n**Reason:** ${reason}`);

     user.send(`${author} has warned you on ${message.guild.name} for \`${reason}\``)
		 client.channels.get(modlog.id).send({embed}).catch(console.error);
     message.channel.send(`${author} has successfully warned ${user} for \`${reason}\``)
   }

if(command === 'server') {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.send({embed: {
     color: 3447003,
     author: {
       name: message.author.user,
       icon_url: message.author.avatarURL
     },
     title: "This gives you the link to my creators server!",
     url: "https://discord.gg/9KjV4Pq",
     description: "it's right below me!",
     fields: [{
         name: "dont tell anyone, but the link is",
         value: "***https://discord.gg/9KjV4Pq***",
       }],
         timestamp: new Date(),
     footer: {
       icon_url: message.author.avatarURL,
       text: message.author.username + " Wants to join my creators server!"
     }
   }
 });
   }

if(command === 'ping') {
    if(message.content.length > 4 + config.prefix.length) return;
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: message.author.user,
      icon_url: message.author.avatarURL
    },
    title: "This tells you your internet speeds!",
    url: "https://speedtest.net/",
    description: "This tells you my ping!",
    fields: [{
        name: "My ping is:",
        value: "**" + Math.round(client.ping) + " ms!**"
      }],
        timestamp: new Date(),
    footer: {
      icon_url: message.author.avatarURL,
      text: message.author.username + " Wants to know my current ping!"
    }
  }
});
  }

if(command === 'uptime') {
    if(message.content.length > 6 + config.prefix.length) return;
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: message.author.user,
      icon_url: message.author.avatarURL
    },
    title: "You wanna know how long i've been online?",
    description: "ok, i'll tell you how long i've been online",
    fields: [{
        name: "i've been online for",
        value: uptime(),
            }],
        timestamp: new Date(),
    footer: {
      icon_url: message.author.avatarURL,
      text: message.author.username + " Wants to know how long i have been on for!"
    }
  }
});
  }

if(command === 'devs') {
    if(message.content.length > 4 + config.prefix.length) return;
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: message.author.user,
      icon_url: message.author.avatarURL
    },
    title: "You want to know who my developer(s) are?",
    description: "This will tell you!",
    fields: [{
        name: "My developer(s) are...",
        value: '<@260613515763646466>  **(Freddy Fazbear✓Verified#7358)**'
            }],
        timestamp: new Date(),
    footer: {
      icon_url: message.author.avatarURL,
      text: message.author.username + " Wants to know who my dev(s) are!"
    }
  }
});
  }

		if(command === 'say') {
		  var say = args.slice(1).join(' ')
		  if (!say) return message.channel.send('say what?');

		  message.channel.send(say)
		  message.delete()
		}

if(command === 'invite') {
        if(message.content.length > 6 + config.prefix.length) return;
        message.channel.send({embed: {
        color: 3447003,
        author: {
          name: message.author.user,
          icon_url: message.author.avatarURL
        },
        title: "You wanna invite me?",
        url: config.invite,
        description: "ok, i'll give you my invite link!",
        fields: [{
            name: "My invite link is:",
            value: `**${config.invite}**`,
          }],
            timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: message.author.username + " Wants to add me to their server!"
        }
      }
    });
      }

if(command === 'creator') {
        if(message.content.length > 7 + config.prefix.length) return;
        message.channel.send({embed: {
        color: 3447003,
        author: {
          name: message.author.user,
          icon_url: message.author.avatarURL
        },
        title: "This tells you who created me!",
        url: "http://ffffidget.com/",
        description: "The person who made me is:",
        fields: [{
            name: "i was made by",
            value: "**The Doctor#5392**",
          }],
            timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: message.author.username + " Wants to know who made me!!"
        }
      }
    });
      }


if(command === 'servers') {
     if(message.content.length > 7 + config.prefix.length) return;
     message.channel.send(client.guilds.map(g => "`" + `${g.name} | ${g.memberCount}` + "`")).catch(console.error);
   } else

if(command === 'cookie') {
        if(message.content.length > 6 + config.prefix.length) return;
        message.channel.send(':cookie::milk::milk:  :cookie: :cookie: :cookie: :cookie: :cookie: :cookie: :cookie: COOKIES, COOKIES FOR DAYS!!!!');
        }


if(command === 'servercount') {
         if(message.content.length > 11 + config.prefix.length) return;
         message.channel.send('Total Server Count: `' + client.guilds.size + '`').catch(console.error);
       }

if(command === 'membercount') {
         if(message.content.length > 11 + config.prefix.length) return;
         message.channel.send('Total Member Count: `' + message.guild.memberCount + '`').catch(console.error);
       }

			 if(command === 'help') {
			     message.channel.send(message.member.user + ', Please check your DMs :incoming_envelope:')
			 		message.author.send(`***Commands:***
			 		\`\`\`
			 ${config.prefix}serverinfo - Shows you info about the current server
			 ${config.prefix}addrole - adds a role to the mentioned user. DO NOT MENTION ROLE!
			 ${config.prefix}removerole - removes a role from the mentioned user. DO NOT MENTION ROLE!
			 ${config.prefix}setgame - sets the bots game
			 ${config.prefix}status - sets the bots status (invisible, idle, dnd, online)
			 ${config.prefix}nickname - sets the mentioned users nickname
			 ${config.prefix}order - orders food food
			 ${config.prefix}serve - gives mentioned user their food (${config.prefix}serve @user <link to image of food>)
			 ${config.prefix}nuke - nukes server (not delete all messages)
			 ${config.prefix}vi - you'll see (nothing bad, just sends message)
			 ${config.prefix}explode - explodes the nuke (still not delete messages)
			 ${config.prefix}report - reports bug to owner
			 ${config.prefix}hug - hugs mentioned user
			 ${config.prefix}stab - stabs mentioned user
			 ${config.prefix}shoot - shoots mentioned user
			 ${config.prefix}kiss - kisses mentioned user
			 ${config.prefix}sleep - puts mentioned user to sleep
			 ${config.prefix}revive - revives mentioned user
			 ${config.prefix}slap - slaps mentioned user
			 ${config.prefix}kill - kills mentioned user
			 ${config.prefix}drunk - mention a user you think is drunk with this command... hehehehe
			 ${config.prefix}avatar - get mentioned user's avatar
			 ${config.prefix}mytime - the bots time, not yours
			 ${config.prefix}agree - agree to the servers rules and to stay active in it
			 ${config.prefix}globalmembers - shows you how many users are in all servers combined (all servers the bot is in)
			 ${config.prefix}hacker - looks for hacker (doesnt really tell you who is a hacker, dont use this for actually finding hackers)
			 ${config.prefix}restart - restarts the bot (owner only)
			 ${config.prefix}wakespy - wakes up SpySniper9
			 ${config.prefix}sinvite (broken) - should show u the invite to the server... like it says, broken
			 ${config.prefix}myavatar - shows u ur avatar
			 ${config.prefix}tbomb - tells u who tbomb is
			 ${config.prefix}help - shows this message
			 ${config.prefix}bans (broken) - <--- brokened
			 ${config.prefix}info - shows info about the bot (the random number(if shown as random numbers) should be a mention for The Doctor#5392)
			 		\`\`\``);
			     message.author.send(`***Commands:***
			  \`\`\`
			 ${config.prefix}hi, hey, hallo - Says Hello to Midnight Hype
			 ${config.prefix}ping - PONG
			 ${config.prefix}membercount - Displays the total members of the server
			 ${config.prefix}servercount - Displays the number of servers Midnight Hype is running on
			 ${config.prefix}servers - Lists the servers Midnight Hype is on
			 ${config.prefix}invite - gives you the link to add the client to your server!
			 ${config.prefix}server - Sends you a link to my creators server!
			 ${config.prefix}creator - Tells you who made this bot!
			 ${config.prefix}oliver - Gives you the link to an epic Instagram
			 ${config.prefix}rcm - Surprise
			 ${config.prefix}fire - Fire engine putting out fire!
			 ${config.prefix}cookie - Surprise for Crazycookie155YT
			 ${config.prefix}uptime - Tells you my uptime

			     \`\`\`
			     **Music Commands**
			     \`\`\`
			 ${config.prefix}play (<url>|<name>): Play a video/music. It can take a URL or query from various services (YouTube, Vimeo, YouKu, etc).
			 ${config.prefix}skip [number]: Skip some number of songs. Will skip 1 song if a number is not specified.
			 ${config.prefix}queue: Display the current queue.
			 ${config.prefix}pause: Pause music playback.
			 ${config.prefix}resume: Resume music playback.
			 ${config.prefix}volume: Adjust the playback volume between 1 and 200
			 ${config.prefix}leave: Clears the song queue and leaves the channel.
			 ${config.prefix}clearqueue: Clears the song queue.
			     \`\`\`
			     ***Moderation Commands***
			     \`\`\`
			 ${config.prefix}addrole - adds a role to the mentioned user. DO NOT MENTION ROLE!
			 ${config.prefix}removerole - removes a role from the mentioned user. DO NOT MENTION ROLE!
			 ${config.prefix}mute - mutes the mentioned user
			 ${config.prefix}unmute - unmuted the mentioned user
			 ${config.prefix}say [#channel_name] <message> - Says the Message in the specified channel
			 ${config.prefix}purge <number of messages to delete 1-99> - deletes the specified amount of messages in the current channe
			 ${config.prefix}prune <number of messages to delete 1-99> - deletes the specified amount of messages in the current channel
			 ${config.prefix}kick <@user_to_kick> - Kicks the mentioned user
			 ${config.prefix}ban <@user_to_ban> - Bans the mentioned user
			 ${config.prefix}warn <@user to warn> <reason> - Sends the mentioned user a warning in Direct Message
			     \`\`\`
			     ***If you have any other issues please contact me on: https://discord.gg/9KjV4Pq***
			     `);
			     };

  });


client.login(config.token);

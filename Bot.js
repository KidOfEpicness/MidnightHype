//If you edit this, removing my credit from the bot will void the license, so leave credit in or you will be holding an illegal copy of this bot
//if you are not editing, you may ignore this
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
const music = require('discord.js-music-v11')
music(client, {
	prefix: `${config.prefix}`,        // Prefix of '-'.
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

function addRole(role) {
  if (!(role instanceof Role)) role = this.guild.roles.get(role);
  if (!role) throw new TypeError('Supplied parameter was neither a Role nor a Snowflake.');
  return this.client.rest.methods.addMemberRole(this, role);
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
});

client.on('guildpurge', guild => {
   client.user.setPresence({ game: { name: client.guilds.size + ' servers | ' + config.prefix + 'help', type: 0 } });
});

client.on('message', message => {
  var args = message.content.split(/[ ]/)
  if(message.author.bot) return;
  if (message.channel.type == "dm") return;


if(message.content.startsWith(config.prefix + 'mute')) {
  let reason = args.slice(2).join(' ');
  let user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'member-log');
  let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'muted');
  if (!modlog) return message.reply('I cannot find a mod-log channel').catch(console.error);
  if (!muteRole) return message.reply('I cannot find a mute role (please make a role named `muted` with only 2 permissions, read messages and read message history.)').catch(console.error);
  if (reason.length < 1) return message.reply('You must supply a reason for the mute.').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Un/mute\n**Target:** ${user}\n**Moderator:** ${message.author}\n**Reason:** ${reason}`);
message.channel.send('**__User successfully muted/unmuted__**');

  if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the correct permissions.').catch(console.error);

  if (message.guild.member(user).roles.has(muteRole.id)) {
    message.guild.member(user).removeRole(muteRole).then(() => {
      client.channels.get(modlog.id).send({embed}).catch(console.error);
    });
  } else {
    message.guild.member(user).addRole(muteRole).then(() => {
      client.channels.get(modlog.id).send({embed}).catch(console.error);
    })
}
};

if(message.content.startsWith(config.prefix + "order")) {
  var order = args.slice(1).join(' ')
  var user = message.author.username
  var guild = message.guild.name
  if(!order) return message.channel.send('What is your order?');

  message.channel.send(`The Kitchen has recieved your order ${order}, they will make it soon (check your DMs)`)
  client.channels.get('350583815627997184').send(`We have recieved a new order from ${user}, \`${order}\` in ${guild} (${message.author.id}) (` + message.author + ')')
  message.author.send(`We have recieved your order, Someone will Direct Message you with your ${order} soon!`)
}

if(message.content.startsWith(config.prefix + "serve")) {
  if(message.content.length > 5 + config.prefix.length) return;
  var response = args.slice(2).join(' ')
  var user = message.author.username
  var mention = message.mentions.users.first()
  if(!response) return message.channel.send('What is your response?');

client.channels.get('350766799974957078').send(`Yo ${mention}, Heres your food ${response}`)
message.channel.send(`I have sent your response (${response}) to The Dining Room`)
}

if(message.content.startsWith(config.prefix + 'purge')) {
  if(args[0].length > 6 + config.prefix.length) return;
  if(Role(message.member, "Bot Commander") || message.author.id != config.owner) {

    if(args.slice(1).length < 1) {
      message.channel.send('You didnt define any arguments. Usage: `' + `${config.prefix}purge <number of messages to purge 1-99>` + '`').catch(console.error);
    } else {
      if(args.slice(1) === "0") {
        message.channel.send('You defined an invalid argument. Usage: `' + `${config.prefix}purge <number of messages to purge 1-99>` + '`').catch(console.error);
      } else {
      if(args[1].length >= 3) {
        message.channel.send('You defined too many arguments. Usage `' + `${config.prefix}purge <number of messages to purge 1-99>` + '`').catch(console.error);
      } else {
        var msg;
        if(args.length === 1) {
            msg=2;
        } else {
          msg=parseInt(args[1]) + 1;
        }
        message.channel.fetchMessages({limit: msg}).then(messages => {
          if(messages.size <= 1) return;
          message.channel.bulkDelete(messages)}).catch(console.log);
      }
    }
  }
    } else {
      message.channel.send('You dont have the `Bot Commander` role');
    }
  } else

if(message.content.startsWith(config.prefix + 'say')) {
  if(args[0].length > 3 + config.prefix.length) return;
  if(Role(message.member, "Bot Commander") || message.author.id != config.owner) {
  if(args.length <= 1) {
      return message.channel.send('You did not define any arguments. Usage: `' + `${config.prefix}say [channel] <message>` + '`').catch(console.error);
    }
    var Say = args.slice(2).join(" ");
    var chan = message.mentions.channels.first();
    if (!chan) {
      Say = args.slice(1).join(" ");
      chan = message.channel;
    }
  chan.send(Say);
  } else {
    message.channel.send('You do not have the `Bot Commander` role').catch(console.error);
  }
} else

if(message.content.startsWith(config.prefix + 'kick')) {
     if(args[0].length > 4 + config.prefix.length) return;
    if(Role(message.member, "Bot Commander") || message.author.id != config.owner) {
       if(message.isMentioned("29820102122471424")) {
         return message.channel.send('Midnight Hype cannot kick itself!. Usage: `' + `${config.prefix}kick <@User to kick>` + '`').catch(console.error);
       }
       if(message.isMentioned("224632668187394048")) {
         return message.channel.send('Midnight Hype cannot kick its creator!. Usage: `' + `${config.prefix}kick <@User to kick>` + '`').catch(console.error);
       }
       if(message.isMentioned("244958092909871107")) {
         return message.channel.send('Midnight Hype cannot kick its creator!. Usage: `' + `${config.prefix}kick <@User to kick>` + '`').catch(console.error);
       }
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to kick. Usage: `' + `${config.prefix}kick <@User to Kick>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to kick. Usage: `' + `${config.prefix}kick <@User to Kick>` + '`').catch(console.error);
       }
       if(message.mentions.users.size < 1) {
         return message.channel.send('You did not mention a user. Usage: `' + `${config.prefix}kick <@User to kick>` + '`');
       }
       if(message.mentions.users.first() === message.member.user) {
         return message.channel.send('You cannot kick yourself! Usage: `' + `${config.prefix}kick <@User to kick>` + '`').catch(console.error);
       }
       let kickMember = message.guild.member(message.mentions.users.first());
       if(!kickMember) {
         return message.channel.send('That user is not Valid');
       }
       if(!message.guild.member(client.user).hasPermission(0x00000002)) {
         return message.channel.send('I dont have the permission `KICK_MEMBERS` to do this.').catch(console.error);
       } else {
       kickMember.kick().then(member => {
         message.channel.send(`${member.user} Was Successfully Kicked From The Server!`).catch(console.error);
       });
     }
     } else {
       message.channel.send('You dont have the `Bot Commander` role').catch(console.error);
     }
   } else

if(message.content.startsWith(config.prefix + 'ban')) {
     if(args[0].length > 3 + config.prefix.length) return;
    if(Role(message.member, "Bot Commander") || message.author.id != config.owner) {
       if(message.isMentioned("291015751752613892")) {
         return message.channel.send("Midnight Hype cannot ban itself. Usage: `" + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.isMentioned("224632668187394048")) {
         return message.channel.send('Midnight Hype cannot ban its creator!. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.isMentioned("244958092909871107")) {
         return message.channel.send('Midnight Hype cannot ban its creator!. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.isMentioned("227177798303875073")) {
         return message.channel.send('Midnight Hype cannot ban its creator!. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to ban. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to ban. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       let banMember = message.guild.member(message.mentions.users.first());
       if(!banMember) {
         return message.channel.send('That user is not Valid');
       }
       if(!message.guild.member(client.user).hasPermission(0x00000004)) {
         return message.channel.send('I dont have the permission `BAN_MEMBERS` to do this.').catch(console.error);
       }
       banMember.ban().then(member => {
         message.channel.send(`${member.user} got https://giphy.com/gifs/ban-MEw0inp5gAlzO`).catch(console.error);
       });
     } else {
       message.channel.send('You dont have the `Bot Commander` role').catch(console.error);
     }
   } else


if(message.content.startsWith(config.prefix + 'warn')) {
     if(args[0].length > 4 + config.prefix.length) return;
    if(Role(message.member, "Bot Commander") || message.author.id != config.owner) {
       if(message.isMentioned("298201021224714241")) {
         return message.channel.send('Midnight Hype cannot warn itself. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.isMentioned("224632668187394048")) {
         return message.channel.send('Midnight Hype cannot warn its creator!. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.isMentioned("227177798303875073")) {
         return message.channel.send('Midnight Hype cannot warn its creator!. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.isMentioned("244958092909871107")) {
         return message.channel.send('Midnight Hype cannot warn its creator!. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.mentions.users.size === 0) {
         return message.channel.send('You did not Mention a user to warn. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.send('You Mentioned too many users to warn. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(args.length === 1) {
         message.channel.send('You did not define any arguments. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       } else {
         if(!args[1].includes('@')) {
           return message.channel.send('You did not Mention a user to warn. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.send('You did not Mention a user to warn. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           message.channel.send('You have not given a reason for the Warning. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
         } else {
           message.channel.send('warned ' + message.mentions.users.first() + ' for ` ' + args.slice(2).join(' ') + ' `');
           message.mentions.users.first().send('You have been given a warning for ` ' + args.slice(2).join(' ') + ' ` on ' + message.guild.name + ' Please refrain from doing it again.').catch(console.error);
         }
       }
       }
       }
     } else {
       message.channel.send('You dont have the `Bot Commander` role ' ).catch(console.error);
     }
   } else

if(message.content.startsWith(config.prefix + 'report')) {
     if(args[0].length > 6 + config.prefix.length) return;
       if(args.length === 1) {
         message.channel.send('You did not define any arguments. Usage: `' + `${config.prefix}report . <message>` + '`').catch(console.error);
       } else {
         if(args.slice(1).join(' ').length === 0) {
           message.channel.send('You have not given a message for my support team!. Usage: `' + `${config.prefix}report . <message>` + '` (if you put a 1 word message, just put a dot then a space then your message, theres a glitch in discord.js causing that to happen)').catch(console.error);
         } else {
           message.channel.send('I have sent the report ` ' + args.slice(1).join(' ') + ' ` to my support team!');
           client.channels.get('324723677461610497').send("<@&324721974590963716> we have a new report from " + message.member + ', ` ' + args.slice(1).join(' ') + ' ` good luck!').catch(console.error)
         }
        }
   } else

if(message.content.startsWith(config.prefix + 'hug')) {
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

if(message.content.startsWith(config.prefix + 'stab')) {
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

if(message.content.startsWith(config.prefix + 'shoot')) {
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

if(message.content.startsWith(config.prefix + 'kiss')) {
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

if(message.content.startsWith(config.prefix + 'sleep')) {
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

if(message.content.startsWith(config.prefix + 'revive')) {
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

if(message.content.startsWith(config.prefix + 'slap')) {
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

if(message.content.startsWith(config.prefix + 'kill')) {
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

if(message.content.startsWith(config.prefix + 'drunk')) {
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

if(message.content.startsWith(config.prefix + 'avatar')) {
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
         message.channel.send(message.member.user + ', ' + message.mentions.users.first() + '\'s avatar is ' + message.mentions.users.first().avatarURL);
       }
     }
     }
     }
 } else

if(message.content.startsWith(config.prefix + 'add')) {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p+c);

    message.channel.send(total);
   }

if(message.content.startsWith(config.prefix + 'eval')) {
     if(message.author.id !== "224632668187394048") return;
     try {
       var code = args.join(" ");
       var evaled = eval(code);

       if (typeof evaled !== "string")
         evaled = require("util").inspect(evaled);

         message.channel.sendCode("xl", clean(evaled));
       } catch(err) {
         message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
       }
   }

if(message.content.startsWith(config.prefix + 'mytime')) {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.send(Date(client.uptime)).catch(console.error);
   } else

if(message.content.startsWith(config.prefix + 'agree')) {
     if(message.content.length > 5 + config.prefix.length) return;
     message.channel.send(message.member.user + ' has agreed to the rules and to stay active in this server. Timestamped: `' + (Date(client.uptime)) + '`');
   } else

if(message.content.startsWith(config.prefix + 'hi')) {
     if(message.content.length > 2 + config.prefix.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else

if(message.content.startsWith(config.prefix + 'globalmembers')) {
     if(message.content.length > 13 + config.prefix.length) return;
     message.channel.send(`I am used by ${client.guilds.reduce((p, c) => p + c.memberCount, 0)} people!`)
   }

if(message.content.startsWith(config.prefix + 'liar')) {
     if(message.content.length > 4 + config.prefix.length) return;
     message.channel.send(message.mentions.users.first() + ' is a liar!').catch(console.error);
   } else

if(message.content.startsWith(config.prefix + 'hacker')) {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.send(message.author.username + ' i dont see any hackers!').catch(console.error);
   } else

/*   if(command === "name") {
     if(message.content.length > 4 + config.prefix.length) return;
     if(message.author.id !== config.owner)
     client.user.setUsername('Midnight Hype')
      .then(user => console.log(`My new username is ${user.username}`))
      .catch(console.error);
   } else */

if(message.content.startsWith(config.prefix + 'fire')) {
     if(message.content.length > 4 + config.prefix.length) return;
     message.channel.send(':fire: :droplet: :fire_engine: :man:').catch(console.error);
   } else

if(message.content.startsWith(config.prefix + 'restart')) {
  if(message.content.length > 7 + config.prefix.length) return;
     if(message.author.id !== config.owner)
     return message.channel.send(`**Sorry! You\'re not the owner :P How did you find this command though? :thinking:\nBot Owner: The Doctor#5392**`);
     message.channel.send(`**Shutting Down! :wave:**` + " Credit to ᐯ ҉ᑭ ♆ Wolfie.js#4288").then(() => process.exit(0));
     } else

if(message.content.startsWith(config.prefix + 'rcm')) {
     if(message.content.length > 3 + config.prefix.length) return;
     message.channel.send('**<@263334429106110465> is da best person to live**').catch(console.error);
   } else


if(message.content.startsWith(config.prefix + 'oliver')) {
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

if(message.content.startsWith(config.prefix + 'info')) {
    if(message.content.length > 4 + config.prefix.length) return;
  message.channel.sendEmbed({
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
})};

   if(message.content.startsWith(config.prefix + 'wakespy')) {
   if(message.content.length > 7 + config.prefix.length) return;
     message.channel.send(message.member.user + ' just woke <@259876270215659522> up');
   } else

if(message.content.startsWith(config.prefix + 'sinvite')) {
     if(message.content.length > 7 +config.prefix.length) return;
     message.channel.send('I see you want an invite. Here is an invite ' + client.guild.fetchInvite() + ', enjoy!').catch(console.error);
   } else

if(message.content.startsWith(config.prefix + 'hey')) {
     if(message.content.length > 3 + config.prefix.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else

if(message.content.startsWith(config.prefix + 'hallo')) {
     if(message.content.length > 5 + config.prefix.length) return;
     message.channel.send('Hello, ' + message.author.username).catch(console.error);
   } else


if(message.content.startsWith(config.prefix + 'updates')) {
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


if(message.content.startsWith(config.prefix + 'myavatar')) {
  if(message.content.length > 6 + config.prefix.length) return;
  message.channel.send("Your avatar is " + message.author.avatarURL).catch(console.error);
} else

if(message.content.startsWith(config.prefix + 'tbomb')) {
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

if(message.content.startsWith(config.prefix + 'server')) {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.send({embed: {
     color: 3447003,
     author: {
       name: message.author.user,
       icon_url: message.author.avatarURL
     },
     title: "This gives you the link to my creators server!",
     url: "https://discord.gg/ztezxDh",
     description: "it's right below me!",
     fields: [{
         name: "dont tell anyone, but the link is",
         value: "***https://discord.gg/ztezxDh***",
       }],
         timestamp: new Date(),
     footer: {
       icon_url: message.author.avatarURL,
       text: message.author.username + " Wants to join my creators server!"
     }
   }
 });
   }

if(message.content.startsWith(config.prefix + 'png')) {
     if(message.content.length > 4 + config.prefix.length) return;
     message.channel.send("Ping? (if you still see this message after 5 seconds, that means the command failed halfway through, please just execute the command again.)").then(m => m.edit({embed: {
     color: 3447003,
     author: {
       name: message.author.user,
       icon_url: message.author.avatarURL
     },
     title: "This tells you your internet speeds!",
     url: "https://speedtest.net/",
     description: "This tells you my ping!",
     fields: [{
         name: "My message response latency is:",
         value: `${message.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`
       }],
         timestamp: new Date(),
     footer: {
       icon_url: message.author.avatarURL,
       text: message.author.username + " Wants to know my current ping!"
     }
   }
 }));
  }

//`Pong! Latency is ${message.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`


if(message.content.startsWith(config.prefix + 'ping')) {
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

if(message.content.startsWith(config.prefix + 'uptime')) {
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

if(message.content.startsWith(config.prefix + 'devs')) {
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
        value: "<@" + config.dev + '>  **(Freddy Fazbear✓ᵛᵉʳᶦᶠᶦᵉᵈ#7358)!!!**'
            }],
        timestamp: new Date(),
    footer: {
      icon_url: message.author.avatarURL,
      text: message.author.username + " Wants to know who my dev(s) are!"
    }
  }
});
  }

if(message.content.startsWith(config.prefix + 'help')) {
    message.channel.send(message.member.user + ', Please check your DMs :incoming_envelope:')
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
    ***Moderation Commands  (Requires Bot Commander Role)***
    \`\`\`
    ${config.prefix}say [#channel_name] <message> - Says the Message in the specified channel
    ${config.prefix}delete <number of messages to delete 1-99> - Deletes the specified amount of messages in the current channel
    ${config.prefix}kick <@user_to_kick> - Kicks the mentioned user
    ${config.prefix}ban <@user_to_ban> - Bans the mentioned user
    ${config.prefix}warn <@user to warn> <reason> - Sends the mentioned user a warning in Direct Message
    \`\`\`
    ***If you have any other issues please contact me on:*** https://discord.gg/YKCWkua
    `);
    };

if(message.content.startsWith(config.prefix + 'invite')) {
        if(message.content.length > 6 + config.prefix.length) return;
        message.channel.send({embed: {
        color: 3447003,
        author: {
          name: message.author.user,
          icon_url: message.author.avatarURL
        },
        title: "You wanna invite me?",
        url: "https://discordapp.com/oauth2/authorize?client_id=291015751752613892&scope=client&permissions=8",
        description: "ok, i'll give you my invite link!",
        fields: [{
            name: "My invite link is:",
            value: "**https://discordapp.com/oauth2/authorize?client_id=291015751752613892&scope=client&permissions=8**",
          }],
            timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: message.author.username + " Wants to add me to their server!"
        }
      }
    });
      }

if(message.content.startsWith(config.prefix + 'creator')) {
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


if(message.content.startsWith(config.prefix + 'servers')) {
     if(message.content.length > 7 + config.prefix.length) return;
     message.channel.send(client.guilds.map(g => "`" + `${g.name} | ${g.memberCount}` + "`")).catch(console.error);
   } else

if(message.content.startsWith(config.prefix + 'cookie')) {
        if(message.content.length > 6 + config.prefix.length) return;
        message.channel.send(':cookie::milk::milk:  :cookie: :cookie: :cookie: :cookie: :cookie: :cookie: :cookie: COOKIES, COOKIES FOR DAYS!!!!');
        }


if(message.content.startsWith(config.prefix + 'servercount')) {
         if(message.content.length > 11 + config.prefix.length) return;
         message.channel.send('Total Server Count: `' + client.guilds.size + '`').catch(console.error);
       }

if(message.content.startsWith(config.prefix + 'membercount')) {
         if(message.content.length > 11 + config.prefix.length) return;
         message.channel.send('Total Member Count: `' + message.guild.memberCount + '`').catch(console.error);
       }
  });


client.login(config.token);

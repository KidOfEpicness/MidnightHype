const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const fs = require('fs')

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
    var date = new Date(bot.uptime);
    var strDate = '';
    strDate += date.getUTCDate() - 1 + " days, ";
    strDate += date.getUTCHours() + " hours, ";
    strDate += date.getUTCMinutes() + " minutes, ";
    strDate += date.getUTCSeconds() + " seconds";
    return strDate;
}

bot.on('ready', () => {
  console.log(`Ready to begin serving in `  + bot.guilds.size + ` servers!`);
  bot.user.setGame(bot.guilds.size + ' servers | ' + config.prefix + 'help.');
});

bot.on("disconnected", function () {
	console.log("Disconnected!");
});

bot.on('guildCreate', guild => {
  bot.user.setGame(bot.guilds.size + ' servers | ' + config.prefix + 'help.');
});

bot.on('guildpurge', guild => {
  bot.user.setGame(bot.guilds.size + ' servers | ' + config.prefix + 'help.');
});

bot.on('message', message => {
  var args = message.content.split(/[ ]/)
  if(message.author.bot) return;
  if (message.channel.type == "dm") return;

  let command = message.content.split(" ")[0];
  command = command.toLowerCase().slice(config.prefix.length);

if(!message.content.startsWith(config.prefix)) return;
/*

if(command === "mute") {
  if(args[0].length > 4 + config.prefix.length) return;
  if(Role(message.member, "Bot Commander") || message.author.id !== config.owner) {
    if(message.isMentioned("298201021224714241")) {
      return message.channel.sendMessage('KidsBot cannot mute itself. Usage: `' + `${config.prefix}mute <@User to mute>` + '`').catch(console.error);
    }
    if(message.mentions.users.size === 0) {
      return message.channel.sendMessage('You did not Mention a user to mute. Usage: `' + `${config.prefix}mute <@User to mute>` + '`').catch(console.error);
    }
    if(message.mentions.users.size > 1) {
      return message.channel.sendMessage('You Mentioned too many users to mute. Usage: `' + `${config.prefix}mute <@User to mute>` + '`').catch(console.error);
    }
    if(args.length === 1) {
      message.channel.sendMessage('You did not define any arguments. Usage: `' + `${config.prefix}mute <@User to mute>` + '`').catch(console.error);
    } else {
      if(!args[1].includes('@')) {
        return message.channel.sendMessage('You did not Mention a user to mute. Usage: `' + `${config.prefix}mute <@User to mute>` + '`').catch(console.error);
      } else {
        if(args[1].length <=1) {
          return message.channel.sendMessage('You did not Mention a user to mute. Usage: `' + `${config.prefix}mute <@User to mute>` + '`').catch(console.error);
        } else {
          if(args.slice(2).join(' ').length === 0) {
            message.channel.sendMessage('You have not given a reason for the mute. Usage: `' + `${config.prefix}mute <@User to mute>` + '`').catch(console.error);
          } else {
            message.channel.sendMessage('Muted ' + message.mentions.users.first() + ' for `' + args.slice(2).join(' ') + '`');
            message.mentions.users.first().addRole(mute)
            message.mentions.users.first().send('You have been muted in ' + message.guild.name + ' for `' + args.slice(2).join(' ') + '` by ' + message.author + ' . Please DM an admin to be unmuted.').catch(console.error)
          }
        }
      }
    }
  } else {
    message.channel.sendMessage('You dont have the `Bot Commander` role ' ).catch(console.error);
  }
} else */

if(command === "shutdown") {
  if(message.content.length > 8 + config.prefix.length) return;
  message.channel.sendMessage("My music side will shutdown, but my personal response is... No, Go away").catch(console.error);
} else

if(command === "purge") {
  if(args[0].length > 6 + config.prefix.length) return;
  if(Role(message.member, "Bot Commander") || message.author.id !== config.owner) {

    if(args.slice(1).length < 1) {
      message.channel.sendMessage('You didnt define any arguments. Usage: `' + `${config.prefix}purge <number of messages to purge 1-99>` + '`').catch(console.error);
    } else {
      if(args.slice(1) === "0") {
        message.channel.sendMessage('You defined an invalid argument. Usage: `' + `${config.prefix}purge <number of messages to purge 1-99>` + '`').catch(console.error);
      } else {
      if(args[1].length >= 3) {
        message.channel.sendMessage('You defined too many arguments. Usage `' + `${config.prefix}purge <number of messages to purge 1-99>` + '`').catch(console.error);
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
      message.channel.sendMessage('You dont have the `Bot Commander` role');
    }
  } else

if(command === "say") {
  if(args[0].length > 3 + config.prefix.length) return;
  if(Role(message.member, "Bot Commander") || message.author.id !== config.owner) {
  if(args.length <= 1) {
      return message.channel.sendMessage('You did not define any arguments. Usage: `' + `${config.prefix}say [channel] <message>` + '`').catch(console.error);
    }
    var Say = args.slice(2).join(" ");
    var chan = message.mentions.channels.first();
    if (!chan) {
      Say = args.slice(1).join(" ");
      chan = message.channel;
    }
  chan.sendMessage(Say);
  } else {
    message.channel.sendMessage('You do not have the `Bot Commander` role').catch(console.error);
  }
} else

  if(command === "kick") {
     if(args[0].length > 4 + config.prefix.length) return;
     if(Role(message.member, "Bot Commander") || message.author.id !== config.owner) {
       if(message.isMentioned("29820102122471424")) {
         return message.channel.sendMessage('KidsBot cannot kick itself!. Usage: `' + `${config.prefix}kick <@User to kick>` + '`').catch(console.error);
       }
       if(message.isMentioned("224632668187394048")) {
         return message.channel.sendMessage('KidsBot cannot kick its creator!. Usage: `' + `${config.prefix}kick <@User to kick>` + '`').catch(console.error);
       }
       if(message.isMentioned("244958092909871107")) {
         return message.channel.sendMessage('KidsBot cannot kick its creator!. Usage: `' + `${config.prefix}kick <@User to kick>` + '`').catch(console.error);
       }
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to kick. Usage: `' + `${config.prefix}kick <@User to Kick>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to kick. Usage: `' + `${config.prefix}kick <@User to Kick>` + '`').catch(console.error);
       }
       if(message.mentions.users.size < 1) {
         return message.channel.sendMessage('You did not mention a user. Usage: `' + `${config.prefix}kick <@User to kick>` + '`');
       }
       if(message.mentions.users.first() === message.member.user) {
         return message.channel.sendMessage('You cannot kick yourself! Usage: `' + `${config.prefix}kick <@User to kick>` + '`').catch(console.error);
       }
       let kickMember = message.guild.member(message.mentions.users.first());
       if(!kickMember) {
         return message.channel.sendMessage('That user is not Valid');
       }
       if(!message.guild.member(bot.user).hasPermission(0x00000002)) {
         return message.channel.sendMessage('I dont have the permission `KICK_MEMBERS` to do this.').catch(console.error);
       } else {
       kickMember.kick().then(member => {
         message.channel.sendMessage(`${member.user} Was Successfully Kicked From The Server!`).catch(console.error);
       });
     }
     } else {
       message.channel.sendMessage('You dont have the `Bot Commander` role').catch(console.error);
     }
   } else

   if(command === "ban") {
     if(args[0].length > 3 + config.prefix.length) return;
     if(Role(message.member, "Bot Commander") || message.author.id !== config.owner) {
       if(message.isMentioned("291015751752613892")) {
         return message.channel.sendMessage("KidsBot cannot ban itself. Usage: `" + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.isMentioned("224632668187394048")) {
         return message.channel.sendMessage('KidsBot cannot ban its creator!. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.isMentioned("244958092909871107")) {
         return message.channel.sendMessage('KidsBot cannot ban its creator!. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.isMentioned("227177798303875073")) {
         return message.channel.sendMessage('KidsBot cannot ban its creator!. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to ban. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to ban. Usage: `' + `${config.prefix}ban <@User to ban>` + '`').catch(console.error);
       }
       let banMember = message.guild.member(message.mentions.users.first());
       if(!banMember) {
         return message.channel.sendMessage('That user is not Valid');
       }
       if(!message.guild.member(bot.user).hasPermission(0x00000004)) {
         return message.channel.sendMessage('I dont have the permission `BAN_MEMBERS` to do this.').catch(console.error);
       }
       banMember.ban().then(member => {
         message.channel.sendMessage(`${member.user} got https://giphy.com/gifs/ban-MEw0inp5gAlzO`).catch(console.error);
       });
     } else {
       message.channel.sendMessage('You dont have the `Bot Commander` role').catch(console.error);
     }
   } else


   if(command === "warn") {
     if(args[0].length > 4 + config.prefix.length) return;
     if(Role(message.member, "Bot Commander") || message.author.id !== config.owner) {
       if(message.isMentioned("298201021224714241")) {
         return message.channel.sendMessage('KidsBot cannot warn itself. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.isMentioned("224632668187394048")) {
         return message.channel.sendMessage('KidsBot cannot warn its creator!. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.isMentioned("227177798303875073")) {
         return message.channel.sendMessage('KidsBot cannot warn its creator!. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.isMentioned("244958092909871107")) {
         return message.channel.sendMessage('KidsBot cannot warn its creator!. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to warn. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to warn. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       }
       if(args.length === 1) {
         message.channel.sendMessage('You did not define any arguments. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
       } else {
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention a user to warn. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention a user to warn. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           message.channel.sendMessage('You have not given a reason for the Warning. Usage: `' + `${config.prefix}warn <@User to warn> <reason>` + '`').catch(console.error);
         } else {
           message.channel.sendMessage('warned ' + message.mentions.users.first() + ' for ` ' + args.slice(2).join(' ') + ' `');
           message.mentions.users.first().send('You have been given a warning for ` ' + args.slice(2).join(' ') + ' ` on ' + message.guild.name + ' Please refrain from doing it again.').catch(console.error);
         }
       }
       }
       }
     } else {
       message.channel.sendMessage('You dont have the `Bot Commander` role ' ).catch(console.error);
     }
   } else

   if(command === "hug") {
     if(args[0].length > 4 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to hug. Usage: `' + `${config.prefix}hug <@User to hug>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to hug. Usage: `' + `${config.prefix}hug <@User to hug>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention a user to hug. Usage: `' + `${config.prefix}hug <@User to hug>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention a user to hug. Usage: `' + `${config.prefix}hug <@User to hug>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.sendMessage(message.member.user + ' just hugged ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "stab") {
     if(args[0].length > 4 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
             return message.channel.sendMessage(message.member.user + ' just stabbed themselves :scream:').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to stab. Usage: `' + `${config.prefix}stab <@User to hug>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention a user to stab. Usage: `' + `${config.prefix}stab <@User to hug>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention a user to stab. Usage: `' + `${config.prefix}stab <@User to hug>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.sendMessage(':scream:' + message.member.user + ' just stabbed ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "shoot") {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to shoot. Usage: `' + `${config.prefix}shoot <@User to shoot>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to shoot. Usage: `' + `${config.prefix}shoot <@User to shoot>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention a user to shoot. Usage: `' + `${config.prefix}shoot <@User to shoot>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention a user to shoot. Usage: `' + `${config.prefix}shoot <@User to shoot>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.sendMessage(':scream:' + message.member.user + ' just :gun: shot ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "kiss") {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to kiss. Usage: `' + `${config.prefix}kiss <@User to kiss>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to kiss. Usage: `' + `${config.prefix}kiss <@User to kiss>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention a user to kiss. Usage: `' + `${config.prefix}kiss <@User to kiss>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention a user to kiss. Usage: `' + `${config.prefix}kiss <@User to kiss>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.sendMessage(':open_mouth: :kiss: ' + message.member.user + ' just kissed ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "sleep") {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to put to sleep. Usage: `' + `${config.prefix}sleep <@User to put to sleep>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to put to sleep. Usage: `' + `${config.prefix}sleep <@User to put to sleep>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention to put to sleep. Usage: `' + `${config.prefix}sleep <@User to put to sleep>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention to put to sleep. Usage: `' + `${config.prefix}sleep <@User to put to sleep>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.sendMessage(':sleeping: ' + message.member.user + ' has put ' + message.mentions.users.first() + ' to sleep.');
         }
       }
       }
       }
   } else

   if(command === "revive") {
     if(args[0].length > 6 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to revive. Usage: `' + `${config.prefix}revive <@User to revive>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to revive. Usage: `' + `${config.prefix}revive <@User to revive>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention a user to revive. Usage: `' + `${config.prefix}revive <@User to revive>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention a user to revive. Usage: `' + `${config.prefix}revive <@User to revive` + '`').catch(console.error);
           } else
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.sendMessage(':smile: ' + message.member.user + ' has successfully revived ' + message.mentions.users.first());
         }
       }
       }
  } else

  if(command === "slap") {
    if(args[0].length > 6 + config.prefix.length) return;
      if(message.mentions.users.size === 0) {
        return message.channel.sendMessage('You did not Mention a user to slap. Usage: `' + `${config.prefix}slap <@User to slap>` + '`').catch(console.error);
      }
      if(message.mentions.users.size > 1) {
        return message.channel.sendMessage('You Mentioned too many users to slap. Usage: `' + `${config.prefix}slap <@User to slap>` + '`').catch(console.error);
      }
        if(!args[1].includes('@')) {
          return message.channel.sendMessage('You did not Mention a user to slap. Usage: `' + `${config.prefix}slap <@User to slap>` + '`').catch(console.error);
        } else {
          if(args[1].length <=1) {
            return message.channel.sendMessage('You did not Mention a user to slap. Usage: `' + `${config.prefix}slap <@User to slap` + '`').catch(console.error);
          } else
        if(args.slice(2).join(' ').length === 0) {
          {
          message.channel.sendMessage('rip, ' + message.member.user + ' just slapped ' + message.mentions.users.first() + '!');
        }
      }
      }
 } else

   if(command === "kill") {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not Mention a user to kill. Usage: `' + `${config.prefix}kill <@User to kill>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many users to kill. Usage: `' + `${config.prefix}kill <@User to kill>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention a user to kill. Usage: `' + `${config.prefix}kill <@User to kill>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention a user to kill. Usage: `' + `${config.prefix}kill <@User to kill>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.sendMessage(':scream:' + message.member.user + ' just killed  ' + message.mentions.users.first());
         }
       }
       }
       }
   } else

   if(command === "drunk") {
     if(args[0].length > 5 + config.prefix.length) return;
       if(message.mentions.users.size === 0) {
         return message.channel.sendMessage('You did not mention the drunk user. Usage: `' + `${config.prefix}drunk <Drunk @user>` + '`').catch(console.error);
       }
       if(message.mentions.users.size > 1) {
         return message.channel.sendMessage('You Mentioned too many drunk users. Usage: `' + `${config.prefix}drunk <Drunk @user>` + '`').catch(console.error);
       }
         if(!args[1].includes('@')) {
           return message.channel.sendMessage('You did not Mention the drunk user. Usage: `' + `${config.prefix}drunk <Drunk @user>` + '`').catch(console.error);
         } else {
           if(args[1].length <=1) {
             return message.channel.sendMessage('You did not Mention a drunk user. Usage: `' + `${config.prefix}drunk <Drunk @user>` + '`').catch(console.error);
           } else {
         if(args.slice(2).join(' ').length === 0) {
           {
           message.channel.sendMessage(message.member.user + ' suspects  ' + message.mentions.users.first() + ' is drunk.');
         }
       }
       }
       }
   } else

   if(command === "avatar") {
     if(args[0].length > 6 + config.prefix.length) return;
     if(message.mentions.users.size === 0) {
       return message.channel.sendMessage('You did not mention a user. Usage: `' + `${config.prefix}avatar <@user>` + '`').catch(console.error);
     }
     if(message.mentions.users.size > 1) {
       return message.channel.sendMessage('You Mentioned too many users. Usage: `' + `${config.prefix}avatar <@user>` + '`').catch(console.error);
     }
       if(!args[1].includes('@')) {
         return message.channel.sendMessage('You did not Mention a user. Usage: `' + `${config.prefix}avatar <@user>` + '`').catch(console.error);
       } else {
         if(args[1].length <=1) {
           return message.channel.sendMessage('You did not Mention a user. Usage: `' + `${config.prefix}avatar <@user>` + '`').catch(console.error);
         } else {
       if(args.slice(2).join(' ').length === 0) {
         {
         message.channel.sendMessage(message.member.user + ', ' + message.mentions.users.first() + '\'s avatar is ' + message.mentions.users.first().avatarURL);
       }
     }
     }
     }
 } else

  if(command === "add") {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p+c);

    message.channel.sendMessage(total);
   }

   if(command === "eval") {
     if(message.author.id !== "224632668187394048") return;
     try {
       var code = args.join(" ");
       var evaled = eval(code);

       if (typeof evaled !== "string")
         evaled = require("util").inspect(evaled);

         message.channel.sendCode("xl", clean(evaled));
       } catch(err) {
         message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
       }
   }

   if(command === "mytime") {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.sendMessage(Date(bot.uptime)).catch(console.error);
   } else

   if(command === "agree") {
     if(message.content.length > 5 + config.prefix.length) return;
     message.channel.sendMessage(message.member.user + ' has agreed to the rules and to stay active in this server. Timestamped: `' + (Date(bot.uptime)) + '`');
   } else

   if(command === "hi") {
     if(message.content.length > 2 + config.prefix.length) return;
     message.channel.sendMessage('Hello, ' + message.author.username).catch(console.error);
   } else

   if(command === "liar") {
     if(message.content.length > 4 + config.prefix.length) return;
     message.channel.sendMessage(message.mentions.users.first() + ' is a liar!').catch(console.error);
   } else

   if(command === "hacker") {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.sendMessage(message.author.username + ' i dont see any hackers!').catch(console.error);
   } else

/*   if(command === "name") {
     if(message.content.length > 4 + config.prefix.length) return;
     if(message.author.id !== config.owner)
     bot.user.setUsername('Midnight Hype')
      .then(user => console.log(`My new username is ${user.username}`))
      .catch(console.error);
   } else */

   if(command === "fire") {
     if(message.content.length > 4 + config.prefix.length) return;
     message.channel.sendMessage(':fire: :droplet: :fire_engine: :man:').catch(console.error);
   } else

   if(command === "friend") {
     if(message.content.length > 6 + config.prefix.length) return;
     message.author.addFriend() + ('Please check your friend requests!').catch(console.error);
   } else

   if(command === "rcm") {
     if(message.content.length > 3 + config.prefix.length) return;
     message.channel.sendMessage('**<@263334429106110465> is da best person to live**').catch(console.error);
   } else


      if(command === "oliver") {
        if(message.content.length > 6 + config.prefix.length) return;
        message.channel.sendMessage({embed: {
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

   if(command === "wakespy") {
     if(message.content.length > 7 + config.prefix.length) return;
     message.channel.sendMessage(message.member.user + ' just woke <@259876270215659522> up');
   } else

   if(command === "sinvite") {
     if(message.content.length > 7 +config.prefix.length) return;
     message.channel.sendmessage('I see you want an invite. Here is an invite ' + bot.guild.fetchInvite() + ', enjoy!').catch(console.error);
   } else

   if(command === "hey") {
     if(message.content.length > 3 + config.prefix.length) return;
     message.channel.sendMessage('Hello, ' + message.author.username).catch(console.error);
   } else

   if(command === "hallo") {
     if(message.content.length > 5 + config.prefix.length) return;
     message.channel.sendMessage('Hello, ' + message.author.username).catch(console.error);
   } else


   if(command === "updates") {
     if(message.content.length > 7 + config.prefix.length) return;
     message.channel.sendMessage({embed: {
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
         value: "**most commands are now shown in an embed and i am getting some new commands, check ;;help to see them**"
       }],
         timestamp: new Date(),
     footer: {
       icon_url: message.author.avatarURL,
       text: message.author.username + " Wants to see my updates!"
     }
   }
 });
   }


if(command === "avatar") {
  if(message.content.length > 6 + config.prefix.length) return;
  message.channel.sendMessage("Your avatar is " + message.author.avatarURL).catch(console.error);
} else

   if(command === "tbomb") {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.sendMessage({embed: {
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

   if(command === "server") {
     if(message.content.length > 6 + config.prefix.length) return;
     message.channel.sendMessage({embed: {
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

   if(command === "") {
     if(message.content.length > 4 + config.prefix.length) return;
     message.channel.sendMessage("Ping? (if you still see this message after 5 seconds, that means the command failed halfway through, please just execute the command again.)").then(m => m.edit({embed: {
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
         value: `${message.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`
       }],
         timestamp: new Date(),
     footer: {
       icon_url: message.author.avatarURL,
       text: message.author.username + " Wants to know my current ping!"
     }
   }
 }));
  }

//`Pong! Latency is ${message.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`


  if(command === "ping") {
    if(message.content.length > 3 + config.prefix.length) return;
    message.channel.sendMessage({embed: {
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
        value: "**" + bot.ping + " ms!**"
      }],
        timestamp: new Date(),
    footer: {
      icon_url: message.author.avatarURL,
      text: message.author.username + " Wants to know my current ping!"
    }
  }
});
  }

  if(command === "uptime") {
    if(message.content.length > 6 + config.prefix.length) return;
    message.channel.sendMessage({embed: {
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

  if(command === "devs") {
    if(message.content.length > 4 + config.prefix.length) return;
    message.channel.sendMessage({embed: {
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

    if(command === "help")
    message.channel.sendMessage(message.member.user + ', Please check your DMs :incoming_envelope:').then(m => {
    message.author.send(`***Commands:***
    \`\`\`
    ${config.prefix}hi, hey, hallo - Says Hello to KidsBot
    ${config.prefix}ping - PONG
    ${config.prefix}membercount - Displays the total members of the server
    ${config.prefix}servercount - Displays the number of servers KidsBot is running on
    ${config.prefix}servers - Lists the servers KidsBot is on
    ${config.prefix}invite - gives you the link to add the bot to your server!
    ${config.prefix}server - Sends you a link to (Secondary Dev) RealClientMod || Tyler#5713's Server!
    ${config.prefix}creator - Tells you who made this bot!
    ${config.prefix}oliver - Gives you the link to an epic Instagram
    ${config.prefix}rcm - Surprise
    ${config.prefix}fire - Fire engine putting out fire!
    ${config.prefix}cookie - Surprise for Crazycookie155YT
    ${config.prefix}uptime - Tells you my uptime
    \`\`\`
    ***Moderation Commands  (Requires Bot Commander Role)***
    \`\`\`
    ${config.prefix}say [#channel_name] <message> - Says the Message in the specified channel
    ${config.prefix}delete <number of messages to delete 1-99> - Deletes the specified amount of messages in the current channel
    ${config.prefix}kick <@user_to_kick> - Kicks the mentioned user
    ${config.prefix}ban <@user_to_ban> - Bans the mentioned user
    ${config.prefix}warn <@user to warn> <reason> - Sends the mentioned user a warning in Direct Message
    \`\`\`
    ***If you have any other issues please contact me on:*** https://discord.gg/ztezxDh

     ***Devs Server:*** https://discord.gg/hpd4dmz
    `);
    });

      if(command === "invite") {
        if(message.content.length > 6 + config.prefix.length) return;
        message.channel.sendMessage({embed: {
        color: 3447003,
        author: {
          name: message.author.user,
          icon_url: message.author.avatarURL
        },
        title: "You wanna invite me?",
        url: "https://discordapp.com/oauth2/authorize?client_id=291015751752613892&scope=bot&permissions=8",
        description: "ok, i'll give you my invite link!",
        fields: [{
            name: "My invite link is:",
            value: "**" + config.invite + "**",
          }],
            timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: message.author.username + " Wants to add me to their server!"
        }
      }
    });
      }

      if(command === "creator") {
        if(message.content.length > 7 + config.prefix.length) return;
        message.channel.sendMessage({embed: {
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

   if(command === "h") {
     if(message.content.length > 3 + config.prefix.length) return;
     message.channel.sendMessage(message.member.user + ' just hugged ' + message.mentions.users.first()).catch(console.error);
   }


      if(command === "cookie") {
        if(message.content.length > 6 + config.prefix.length) return;
        message.channel.sendMessage(':cookie::milk::milk:  :cookie: :cookie: :cookie: :cookie: :cookie: :cookie: :cookie: COOKIES, COOKIES FOR DAYS!!!!');
        }


      if(command === "servercount") {
         if(message.content.length > 11 + config.prefix.length) return;
         message.channel.sendMessage('Total Server Count: `' + bot.guilds.size + '`').catch(console.error);
       }

       if(command === "membercount") {
         if(message.content.length > 11 + config.prefix.length) return;
         message.channel.sendMessage('Total Member Count: `' + message.guild.memberCount + '`').catch(console.error);
       }
  });


bot.login(config.token);

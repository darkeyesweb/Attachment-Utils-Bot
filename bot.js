var auth = process.env.ATTACHMENTBOT_TOKEN;
var fs = require('file-system');
var fsa = require('fs');
var http = require('http');
var {
  Client,
  RichEmbed
} = require('discord.js');

var bot = new Client();


function sweepMessages(guild, channel, messageid) {
  fs.mkdir(`M:/Discord/${bot.user.username}/${guild.name}/`);
  channel.fetchMessages({
    before: messageid,
    limit: 100
  }).then(function (messages) {
    var messageindex = 1;
    console.info(`Sweep Triggered in Channel ${guild.name} | ${channel.name} | `, messages.array().length);

    messages.array().forEach((m) => {
      
      messageindex = messageindex + 1;
      var att = null //(m.attachments).array();
      if (att.length) {
        att.forEach((a) => {
          console.log("Attachment: " + a.filename);
          fs.mkdirSync(`M:/Discord/${bot.user.username}/${guild.name}/${channel.name}/attachments/`);
          var file = fs.createWriteStream(`M:/Discord/${bot.user.username}/${guild.name}/${channel.name}/attachments/${a.filename}`);
          http.get(a.url, function (response) {
            response.pipe(file);
          });
        });
      }

        fsa.appendFileSync(`M:/Discord/${bot.user.username}/${guild.name}/${channel.name}/chat.md`, `[${m.author.username}]: ${m.content}\n\n`);
      

      if (messageindex == messages.array().length) {
        if (messages.array().length != 100) {
          var chatlog = fsa.readFileSync(`M:/Discord/${bot.user.username}/${guild.name}/${channel.name}/chat.md`).toString().split("\n\n");
          fs.writeFileSync(`M:/Discord/${bot.user.username}/${guild.name}/${channel.name}/chat.md`, chatlog.join("\n"));
        } else {
          setTimeout(() => {
            sweepMessages(guild, channel, m.id);
          }, 1000);
        }

      }
    });
  }).catch((reason) => {});


}

bot.on('ready', function () {
  // console.log(bot.user.username);
  const g = bot.guilds;
  g.forEach((guild) => {
	setTimeout(() => {
  guild.channels.forEach((channel) => {
      if (channel.type == "text") {
        console.info("Fetching messages from " + guild.name + "|" + channel.name);

        channel.fetchMessages({
          limit: 1
        }).then((message) => {
          sweepMessages(guild, channel, message.id);
        }).catch((reason) => {});
			}

  });
	  }, 5000);
  });

});

bot.login(auth);
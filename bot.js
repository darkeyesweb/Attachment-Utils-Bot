var auth = require('./auth.json');
var fs = require('file-system');
var request = require('request');
var {Client, RichEmbed} = require('discord.js');

var bot = new Client();


function sweepMessages(channel, messageid) {
    console.log("Sweep Triggered in Channel '"+channel.name+'"');
    channel.fetchMessages({before: messageid}).then(function(messages) {
        var messageindex = 1;
        messages.forEach(function(m) {
            messageindex += 1;
            console.log(messageindex);
            fs.writeFile('M:/Discord/'+guild.name+'/'+channel.name+'/'+m.author.username+'/'+m.id+'.txt', m.content);
            if (messageindex == 50) {sweepMessages(channel, m.id)};
        }); 
    }).catch((reason) => {});
}

bot.on('ready', function() {
    // console.log(bot.user.username);
    const g = bot.guilds;

    g.forEach((guild) => {
        
        fs.mkdir("M:/Discord/"+guild.name);
        guild.channels.forEach((channel) => {

            if (channel.type == "text") {
                
                fs.mkdir("M:/Discord/"+guild.name+"/"+channel.name);     
                //console.info("Fetching messages from "+guild.name+"|"+channel.name);

                channel.fetchMessages({limit: 1}).then((message) => {
                    sweepMessages(channel, message.id);
                }).catch((reason) => {});
            }       
            
        });
    });
});


bot.login(auth.token);
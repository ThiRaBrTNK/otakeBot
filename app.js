var TelegramBot = require('node-telegram-bot-api');
var token = process.env.TOKEN;
var bot = new TelegramBot(token, {polling: true});

var chats = [];

bot.on('message', function (msg) {
	chats.push(msg.chat.id)
    console.log(msg);
    bot.sendMessage(chatId, "ololo", {caption: "I'm a bot!"});
});

setInterval(function(){
	chats.forEach(function(){
		bot.sendMessage(this, "chat id is " + this);
	});
}, 5000)

'use strict';
var phantom = require('node-phantom');
var TelegramBot = require('node-telegram-bot-api');
var cheerio = require('cheerio');
console.log(buildCommandRegExp('start', 'multi'))

var token = process.env.TOKEN;
var password = process.env.PASSWORD;
var options = {
	webHook: {
		'port': process.env.PORT,
		'host': process.env.HOST
	}
};
var bot = new TelegramBot(token, options);
var chats = [];
var settings = {};
var POLLING_INTERVAL = 2000;

bot.setWebHook('https://otakebot.herokuapp.com:443/' + token);

function trustChat(chatID) {
	if(!chats.includes(chatID)){
		chats.push(chatID);
	}
};
bot.onText(buildCommandRegExp('help'), function (msg, match) {
	var fromId = msg.chat.id;
	bot.sendMessage(fromId, 'УПЯЧКА!!! Я ИДИОТ, УБЕЙТЕ МЕНЯ КТО-НИБУДЬ!!!1');
});
bot.onText(buildCommandRegExp('start'), function (msg, match) {
	var chatID = msg.chat.id;
	var messageID;
	bot.sendMessage(chatID, 'ОЛОЛО').then(function(msg){
		messageID = msg.message_id
	});
	bot.onReplyToMessage(chatID, messageID, function(msg){
		console.log('got reply')
		if (msg.text === password) {
			trustChat(chatID);
			bot.sendMessage(chatID, 'ЖЕПЬ ЕБРИЛО!!1')
		}
	});
});
bot.on('message', function (msg) {
	var chatId = msg.chat.id;
	// bot.sendMessage(chatId, 'dbg:' + buildCommandRegExp('start', 'multi'));
});
bot.onText(buildCommandRegExp('settings', 'multi'), function (msg, match) {
});

// function update() {
// 	console.log(chats);
// 	request('http://t-9:pr0k0p@patsuchok.t-9.cx/history.php?id=1386', function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			$ = cheerio.load(body);
// 			var result = $('.content h3').filter(function(i, el){
// 				return $(this).text() === 'Задание';
// 			}).nextAll('p').text();
// 			chats.forEach(function(chatId){
// 				bot.sendMessage(chatId, result);
// 			});
// 		}
// 	});
// }

function buildCommandRegExp(command) {
	return new RegExp(`\/${command}(?:@otakeBot)?(?: (.+))?`)
}

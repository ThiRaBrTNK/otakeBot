'use strict';
var phantom = require('node-phantom');
var TelegramBot = require('node-telegram-bot-api');
var cheerio = require('cheerio');
var debug = function(info){
	console.log(info);
}

var token = process.env.TOKEN;
var password = process.env.PASSWORD;
var options = {
	webHook: {
		'port': process.env.PORT,
		'host': process.env.HOST
	}
};
console.log(buildCommandRegExp('start', 'multi'))
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
	var fromId = msg.from.id;
	bot.sendMessage(fromId, 'УПЯЧКА!!! Я ИДИОТ, УБЕЙТЕ МЕНЯ КТО-НИБУДЬ!!!1');
});
bot.onText(buildCommandRegExp('start', 'multi'), function (msg, match) {
	var chatID = msg.chat.id;
	var messageID;
	bot.sendMessage(chatID, 'ОЛОЛО').then(function(msg){
		messageID = msg.message_id
	});
	bot.onReplyToMessage(chatID, messageID, function(msg){
		if (msg.text === password) {
			trustChat(chatID);
			bot.sendMessage(chatID, 'ЖЕПЬ ЕБРИЛО!!1')
		}
	});
});
bot.on('message', function (msg) {
	var chatId = msg.chat.id;
	bot.sendMessage(chatId, 'dbg: message recieved');
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

function buildCommandRegExp(command, args) {
	var argsRegExp = '';
	if (args) {
		argsRegExp = ' ';
		if (args ==='single') {
			argsRegExp += '(.+)';
		} else if (args ==='multi') {
			argsRegExp += '(.*)';
		}
	}
	return new RegExp(`\/${command}(?:@otakeBot)${args}`)
}

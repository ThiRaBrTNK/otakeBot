'use strict';
var phantom = require('node-phantom');
var TelegramBot = require('node-telegram-bot-api');
var cheerio = require('cheerio');

var token = process.env.TOKEN;
var options = {
	webHook: true
};
var bot = new TelegramBot(token, options);
var chats = [];
var POLLING_INTERVAL = 2000;

console.log('running');
console.log(bot.setWebHook('https://otakebot.herokuapp.com:443/' + token));

bot.on('message', function (msg) {
	console.log(msg);
	var chatId = msg.chat.id;
	if(chats.indexOf(chatId) < 0){
		chats.push(chatId);
	}
    bot.sendMessage(chatId, "ololo", {caption: "I'm a bot!"});
    // update();
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

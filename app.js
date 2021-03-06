'use strict';
var phantom = require('node-phantom');
var TelegramBot = require('node-telegram-bot-api');
var cheerio = require('cheerio');
var masterAdmin;
var admins = [];

var token = process.env.TOKEN;
var masterPassword = process.env.PASSWORD;
var password;
var options = {
	webHook: {
		'port': process.env.PORT,
		'host': process.env.HOST
	}
};
var bot = new TelegramBot(token, options);
var trustedChats = [];
var settings = {};
var POLLING_INTERVAL = 2 * 1000;
var SESSION_TIMEOUT = 48 * 60 * 60 * 1000;

bot.setWebHook('https://otakebot.herokuapp.com:443/' + token);

function trustChat(chatID) {
	if(!isChatTrusted(chatID)){
		trustedChats.push(chatID);
	}
}

function isChatTrusted(chatID) {
	return trustedChats.indexOf(chatID) >= 0;
}

function isAdmin(userID) {
	return admins.indexOf(userID) >= 0;
}

function addAdmin(userID) {
	if (!isAdmin(userID)) {
		admins.push(userID);
	}
}

bot.onText(buildCommandRegExp('help'), function (msg, match) {
	var fromId = msg.chat.id;
	bot.sendMessage(fromId, `УПЯЧКА!!! Я ИДИОТ, УБЕЙТЕ МЕНЯ КТО-НИБУДЬ!!!1
		*commands* — description:
		*/start* — start interaction with otakeBot
		*/help* — get this help message
		*/settings* — see your privileges
		*/requestAdminPrivileges* — ask master admin for admin privileges
		*/renounceAdminPrivileges* — give up on your admin privileges
		*/grantAdminPrivileges @username* — grant user admin privileges _for master admin only_
		*/revokeAdminPrivileges @username* — revoke admin privileges from user _for master admin only_
		*/setPassword password* — set password, required for getting admin privileges without requesting/granting _for master admin only_`,
	{
		'parse_mode': 'markdown'
	});
});

bot.onText(buildCommandRegExp('start'), function (msg, match) {
	var chatID = msg.chat.id;
	var messageID;
	if (msg.chat.type === 'private') {
		bot.sendMessage(chatID, 'ОЛОЛО').then(function(msg){
			messageID = msg.message_id;
			bot.onReplyToMessage(chatID, messageID, function(msg){
				if (msg.text === masterPassword && !masterAdmin) {
					masterAdmin = msg.from.id;
					bot.sendMessage(chatID, 'ЖЕПЬ ЕБРИЛО!!1');
				} else if (password && msg.text === password) {
					addAdmin(msg.from.id);
					bot.sendMessage(chatID, 'ЩАЧЛО ПОПЯЧТСА');
				}
			});
		});
	} else {

	}
});

bot.on('message', function (msg) {
	console.log(msg);
});

bot.onText(buildCommandRegExp('settings'), function (msg, match) {
	if (msg.from.id === masterAdmin) {
		bot.sendMessage(msg.chat.id, 'You have master admin privileges.');
	} else if (isChatTrusted(msg.from.id)) {
		bot.sendMessage(msg.chat.id, 'You have admin privileges. Use /renounceAdminPrivileges');
	} else {
		bot.sendMessage(msg.chat.id, 'You don\'t have admin privileges. Use /requestAdminPrivileges to get ones.');
	}
});

bot.onText(buildCommandRegExp('setPassword'), function (msg, match) {
	if (msg.from.id !== masterAdmin) {
		bot.sendMessage(msg.chat.id, 'You don\'t have privileges to do that.');
		return;
	}
	if (match[1]) {
		password = match[1];
		bot.sendMessage(msg.chat.id, 'Password set successfully.');
	} else {
		var messageID;
		bot.sendMessage(msg.chat.id,
		                'Please, provide a password in reply to this message.')
		.then(function(msg){
			messageID = msg.message_id;
		});
		bot.onReplyToMessage(msg.chat.id, messageID, function(msg) {
			password = msg.text;
			bot.sendMessage(msg.chat.id, 'Password set successfully.');
		});
	}
});

bot.onText(buildCommandRegExp('requestAdminPrivileges'), function (msg, match) {
	if (msg.chat.type !== 'group') {
		bot.sendMessage(msg.chat.id, 'Please, request from group conversation.')
		return;
	}
	var name = msg.from.first_name;
	name += msg.from.username ? ' ' + msg.from.username : '';
	name += msg.from.last_name ? ' ' + msg.from.last_name : '';
	if (masterAdmin) {
		bot.sendMessage(masterAdmin,
		                `User ${name} asks for admin privileges. Grant?`, {
			'reply_markup': [
				['Grant'],
				['Do not grant']
			]
		});
	} else {
		bot.sendMessage(msg.chat.id,
		                'There is no master admin to grant you privileges.');
	}
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

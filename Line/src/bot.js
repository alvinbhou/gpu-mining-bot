const linebot = require('linebot');
const bot_API = require('./botAPI');
const message_objects = require('./messageObject');
const async = require("async");


require('dotenv').config()

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken:process.env.CHANNEL_ACCESS_SECRET,
	verify: true // default=true
});

const ALTCOINS = ['ETH','EXP', 'ETC', 'XMR', 'ZEC', 'MC', 'LTC', 'XRP'];
const CHANNEL = 'line';
var COINS_DATA = {
	'BTC': ''
};

bot.on('message', function (event) {
	var chat_id = event.source.profile().then(function (profile) {
						return  profile.userId;
					});
	switch (event.message.type) {
        case 'text':
            var msg = event.message.text.toLowerCase();
			
			if (msg == 'me'){
				event.source.profile().then(function (profile) {
					return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
				});
			}
			else if(msg == 'bot help' || msg.includes('help')){
				bot_API.callAPI('help', {'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
			}
			else if(msg == 'bot coins'){
				event.reply(['請選擇要查詢的幣種', message_objects.bot_coins]);
			}
			else if(msg == 'bot mine'){
				bot_API.callAPI('mine', {'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
			}
			else if(msg == 'bot help'){
				bot_API.callAPI('help', {'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
			}
			else if(msg == 'bot btc'){
				bot_API.callAPI('btc', {'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
			}
			else if(msg == 'p/b網查詢' || msg =="bot polo"){
				event.reply(message_objects.bot_polo_bitt);
			}
			else if(msg =='bot ethwallet'){
				event.reply(message_objects.bot_ethwallet);
			}
			else if(msg == 'bot miner'){
				event.reply(message_objects.bot_miner);
			}
			else if(msg == 'version'){
				event.reply('目前chatbot版本為' + require('../package.json').version);
			}
			else if(msg.substring(0,4) == 'bot '){
				console.log(msg.substring(4,msg.length));
				// Altcoins
				for(var i = 0; i < ALTCOINS.length; ++i){
					
					if(msg.substring(4,msg.length) ==  ALTCOINS[i].toLowerCase()){
						
						bot_API.callAPI('coin', {'coin': ALTCOINS[i],'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
					}
				}
			}
			else{
				event.reply('您好，請問您需要什麼服務？');
			}		
			break;
			
			
				// 	event.reply(msg).then(function (data) {
				// 		console.log('Success', msg, data);
				// 	}).catch(function (error) {
				// 		console.log('Error', error);
				// 	});
				// 	break;
				// console.log('Success', msg, data);
			
		


		case 'image':
			event.message.content().then(function (data) {
				const s = data.toString('base64').substring(0, 30);
				return event.reply('Nice picture! ' + s);
			}).catch(function (err) {
				return event.reply(err.toString());
			});
			break;
		case 'video':
			event.reply('Nice movie!');
			break;
		case 'audio':
			event.reply('Nice song!');
			break;
		case 'location':
			event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
			break;
		case 'sticker':
			event.reply({
				type: 'sticker',
				packageId: 1,
				stickerId: 1
			});
			break;
		default:
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;
	}
});

bot.on('follow', function (event) {
	event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
	event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
	event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
	event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
	bot_API.event_callback(event, event.postback.data);
});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

bot.listen('/webhook', process.env.PORT || 8089, function () {
	console.log('LineBot is running.');
});

function getCoinInfo(params) {
	for(var i = 0; i < ALTCOINS.length; ++i){
		bot_API.callAPI(ALTCOINS[i], 'bot update coin info', COINS_DATA);
	}
}

// setInterval(getCoinInfo, 60000);
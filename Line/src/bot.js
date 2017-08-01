const linebot = require('linebot');
const bot_callback = require('./botCallback');
const message_objects = require('./messageObject');
require('dotenv').config()

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken:process.env.CHANNEL_ACCESS_SECRET,
	verify: true // default=true
});

bot.on('message', function (event) {
	var chat_id = event.source.profile().then(function (profile) {
						return  profile.userId;
					});
	switch (event.message.type) {
        case 'text':
            var msg = event.message.text.toLowerCase();
			switch (msg) {
				case 'me':
					event.source.profile().then(function (profile) {
						return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
					});
					break;
				case 'picture':
					event.reply({
						type: 'image',
						originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
						previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
					});
					break;
				case 'location':
					event.reply({
						type: 'location',
						title: 'LINE Plus Corporation',
						address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
						latitude: 13.7202068,
						longitude: 100.5298698
					});
					break;
				case 'confirm':
					event.reply({
						type: 'template',
						altText: 'this is a confirm template',
						template: {
							type: 'confirm',
							text: 'Are you sure?',
							actions: [{
								type: 'message',
								label: 'Yes',
								text: 'yes'
							}, {
								type: 'message',
								label: 'No',
								text: 'no'
							}]
						}
					});
					break;
				case 'bot coins':
					event.reply(message_objects.bot_coins);
					break;
				case 'p/b網查詢':
					event.reply(message_objects.bot_polo_bitt);
					break;

				case 'bot ethwallet':
					event.reply(message_objects.bot_ethwallet);
					break;	
				
				case 'bot miner':
					event.reply(message_objects.bot_miner);
					break;	
				case 'help':
					event.reply(message_objects.HELP_MESSAGE);
					break;
					
				case 'Multiple':
					return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
					break;
				case 'version':
					event.reply('目前chatbot版本為' + require('../package.json').version);
					break;			
				default:
					event.reply(msg).then(function (data) {
						console.log('Success', msg, data);
					}).catch(function (error) {
						console.log('Error', error);
					});
					break;
				console.log('Success', msg, data);
			}
			break;


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
	bot_callback.process_callback(event, event.postback.data);
});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

bot.listen('/webhook', process.env.PORT || 8089, function () {
	console.log('LineBot is running.');
});

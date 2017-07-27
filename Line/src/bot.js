const linebot = require('linebot');
require('dotenv').config()

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken:process.env.CHANNEL_ACCESS_SECRET,
	verify: true // default=true
});

bot.on('message', function (event) {
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
					event.reply(
						{
							"type": "template",
							"altText": "幣價查詢",
							"template": {
								"type": "carousel",
								"columns": [
									{
										// "thumbnailImageUrl": "https://technoclever.com/wp-content/uploads/2017/07/List-Of-Cryptocurrencies-in-India-Best-to-Invest.jpg",
										"title": "幣價查詢",
										"text": "請選擇要查詢的幣種",
										"actions": [
											{
												"type": "postback",
												"label": "BTC",
												"data": "action=buy&itemid=111"
											},
											{
												"type": "postback",
												"label": "ETH",
												"data": "action=buy&itemid=222"
											},
											{
												"type": "postback",
												"label": "EXP",
												"data": "action=buy&itemid=222"
											},
										]
									},
									{
										// "thumbnailImageUrl": "https://themerkle.com/wp-content/uploads/2017/02/rare-cryptocurrency.jpg",
										"title": "幣價查詢",
										"text": "請選擇要查詢的幣種",
										"actions": [
											
											{
												"type": "postback",
												"label": "ETC",
												"data": "action=buy&itemid=222"
											},
											{
												"type": "postback",
												"label": "XMR",
												"data": "action=buy&itemid=222"
											},
												{
												"type": "postback",
												"label": "ZEC",
												"data": "action=buy&itemid=222"
											}
										]
									},
									{
										// "thumbnailImageUrl": "https://themerkle.com/wp-content/uploads/2017/02/rare-cryptocurrency.jpg",
										"title": "幣價查詢",
										"text": "請選擇要查詢的幣種",
										"actions": [
										
											{
												"type": "postback",
												"label": "MC",
												"data": "action=buy&itemid=222"
											},
											{
												"type": "postback",
												"label": "LTC",
												"data": "action=buy&itemid=222"
											},
											{
												"type": "postback",
												"label": "XRP",
												"data": "action=buy&itemid=222"
											}
										]
									}
								]
							}
						}
							

					);
					break;
				case 'p/b網查詢':
						event.reply(
						{
							"type": "template",
							"altText": "P/B網查詢",
							"template": {
								"type": "carousel",
								"columns": [
									{
										"thumbnailImageUrl": "https://poloniex.com/images/poloniex_icon.png",
										"title": "Poloniex 幣價查詢",
										"text": "下列為快捷按鈕。欲查詢其他幣種，請輸入 bot polo {coin}。(範例：bot polo xmr)",
										"actions": [
											{
												"type": "postback",
												"label": "ETH",
												"data": "action=buy&itemid=111"
											},
											{
												"type": "postback",
												"label": "ZEC",
												"data": "action=buy&itemid=222"
											},
											{
												"type": "postback",
												"label": "MC",
												"data": "action=buy&itemid=222"
											}
										]
									},
									{
										"thumbnailImageUrl": "https://cdn-images-1.medium.com/max/2000/1*uCILqG0jwJs2qjKdUviVkg.png",
										"title": "Bittrex 幣價查詢",
										"text": "下列為快捷按鈕。欲查詢其他幣種，請輸入 bot bitt {coin}。(範例：bot bitt xmr)",
										"actions": [											
											{
												"type": "postback",
												"label": "ETH",
												"data": "action=buy&itemid=111"
											},
											{
												"type": "postback",
												"label": "ZEC",
												"data": "action=buy&itemid=222"
											},
											{
												"type": "postback",
												"label": "MC",
												"data": "action=buy&itemid=222"
											}
										]
									}
								]
							}
						}
							

					);
					break;

				case 'bot ethwallet':
					event.reply({
						type: 'template',
						altText: 'ETH 錢包記錄查詢',
						template: {
							type: 'buttons',
							thumbnailImageUrl: 'http://www.sgebs.ro/uploads/images/2016/7/1/big-ethereum-logo-ljb3.jpg',
							title: 'ETH 錢包記錄查詢',
							text: '請選擇操作',
							actions: [{
								type: 'postback',
								label: '新增地址',
								data: 'action=buy&itemid=123'
							}, {
								type: 'postback',
								label: '查詢紀錄',
								data: 'action=buy&itemid=123'
							}]
						}
					});
					break;	
				
				case 'bot miner':
					event.reply({
						type: 'template',
						altText: 'MC 錢包記錄查詢',
						template: {
							type: 'buttons',
							thumbnailImageUrl: 'https://musicoin.org/images/thumbnail.png',
							title: 'MC 錢包記錄查詢',
							text: '請選擇操作',
							actions: [{
								type: 'postback',
								label: '新增地址',
								data: 'action=buy&itemid=123'
							}, {
								type: 'postback',
								label: '查詢紀錄',
								data: 'action=buy&itemid=123'
							}]
						}
					});
					break;	
				
					
				case 'Multiple':
					return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
					break;
				case 'Version':
					event.reply('目前chatbot版本為' + require('../package.json').version);
					break;
				case 'bot coins':
					event.reply({
						type: 'template',
						altText: '幣價查詢',
						template: {
							type: 'buttons',
							thumbnailImageUrl: 'https://technoclever.com/wp-content/uploads/2017/07/List-Of-Cryptocurrencies-in-India-Best-to-Invest.jpg',
							title: '幣價查詢',
							text: '選擇要查詢的幣種',
							actions: [{
								type: 'postback',
								label: 'BTC',
								data: 'action=buy&itemid=123'
							}, {
								type: 'postback',
								label: 'ETH',
								data: 'action=buy&itemid=123'
							}, {
								type: 'postback',
								label: 'EXP',
								data: 'action=buy&itemid=123'
							}, {
								type: 'postback',
								label: 'ETC',
								data: 'action=buy&itemid=123'
							}]
						}
					});

					
					break;
				default:
					event.reply(msg).then(function (data) {
						console.log('Success', data);
					}).catch(function (error) {
						console.log('Error', error);
					});
					break;
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
	event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

bot.listen('/linewebhook', process.env.PORT || 8089, function () {
	console.log('LineBot is running.');
});

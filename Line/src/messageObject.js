var bot_coins_old = {
	type: 'imagemap',
	baseUrl: 'https://i.imgur.com/FPRV3ZE.png/700',
	altText: '幣價查詢',
	baseSize: { height: 461, width: 701 },
	actions: [
		{
			"type": "message",
			"text": "bot btc",
			"area": {
				"x": 0,
				"y": 0,
				"width": 700,
				"height": 200
			}
		},
		{
			"type": "message",
			"text": "bot eth",
			"area": {
				"x": 0,
				"y": 200,
				"width": 175,
				"height": 130
			}
		},
		{
			"type": "message",
			"text": "bot exp",
			"area": {
				"x": 175,
				"y": 200,
				"width": 175,
				"height": 130
			}
		},
		{
			"type": "message",
			"text": "bot etc",
			"area": {
				"x": 350,
				"y": 200,
				"width": 175,
				"height": 130
			}
		},
		{
			"type": "message",
			"text": "bot xmr",
			"area": {
				"x": 525,
				"y": 200,
				"width": 175,
				"height": 130
			}
		},
		{
			"type": "message",
			"text": "bot zec",
			"area": {
				"x": 0,
				"y": 330,
				"width": 175,
				"height": 130
			}
		},
		{
			"type": "message",
			"text": "bot mc",
			"area": {
				"x": 175,
				"y": 330,
				"width": 175,
				"height": 130
			}
		},
		{
			"type": "message",
			"text": "bot ltc",
			"area": {
				"x": 350,
				"y": 330,
				"width": 175,
				"height": 130
			}
		},
		{
			"type": "message",
			"text": "bot xrp",
			"area": {
				"x": 525,
				"y": 330,
				"width": 175,
				"height": 130
			}
		},

	]
};
var bot_coins = {
	"type": "template",
	"altText": "bot coins",
	"template": {
		"type": "carousel",
		"columns": [
			{
				// "thumbnailImageUrl": "https://technoclever.com/wp-content/uploads/2017/07/List-Of-Cryptocurrencies-in-India-Best-to-Invest.jpg",
				"title": "幣價查詢",
				"text": "請選擇欲查詢的幣種",
				"actions": [
					{
						"type": "postback",
						"label": "BTC",
						"data": '{"action":"bot_coins","itemid":"btc"}'
					},
					{
						"type": "postback",
						"label": "ETH",
						"data": '{"action":"bot_coins","itemid":"eth"}'
					},
					{
						"type": "postback",
						"label": "MC",
						"data": '{"action":"bot_coins","itemid":"mc"}'
					},
				]
			},
			{
				// "thumbnailImageUrl": "https://themerkle.com/wp-content/uploads/2017/02/rare-cryptocurrency.jpg",
				"title": "幣價查詢",
				"text": "請選擇欲查詢的幣種",
				"actions": [

					{
						"type": "postback",
						"label": "ZEC",
						"data": '{"action":"bot_coins","itemid":"zec"}'
					},
					{
						"type": "postback",
						"label": "XMR",
						"data": '{"action":"bot_coins","itemid":"xmr"}'
					},
					{
						"type": "postback",
						"label": "LTC",
						"data": '{"action":"bot_coins","itemid":"ltc"}'
					}
				]
			},
			{
				// "thumbnailImageUrl": "https://themerkle.com/wp-content/uploads/2017/02/rare-cryptocurrency.jpg",
				"title": "幣價查詢",
				"text": "請選擇欲查詢的幣種",
				"actions": [

					{
						"type": "postback",
						"label": "ETC",
						"data": '{"action":"bot_coins","itemid":"etc"}'
					},
					{
						"type": "postback",
						"label": "EXP",
						"data": '{"action":"bot_coins","itemid":"exp"}'
					},
					{
						"type": "postback",
						"label": "XRP",
						"data": '{"action":"bot_coins","itemid":"xrp"}'
					}
				]
			}
		]
	}
};
var bot_polo_twb = {
	"type": "template",
	"altText": "P網/台銀幣價查詢",
	"template": {
		"type": "carousel",
		"columns": [
			{
				// "thumbnailImageUrl": "https://technoclever.com/wp-content/uploads/2017/07/List-Of-Cryptocurrencies-in-India-Best-to-Invest.jpg",
				"title": "P/B網幣價查詢",
				"text": " 欲查詢其他幣種，請輸入 bot polo {coin} [範例: bot polo xmr]",
				"actions": [
					{
						"type": "postback",
						"label": "BTC",
						"data": '{"action":"bot_polo","itemid":"btc"}'
					},
					{
						"type": "postback",
						"label": "ETH",
						"data": '{"action":"bot_polo","itemid":"eth"}'
					},
					{
						"type": "postback",
						"label": "MC",
						"data": '{"action":"bot_polo","itemid":"mc"}'
					},
				]
			},
			{
				// "thumbnailImageUrl": "https://themerkle.com/wp-content/uploads/2017/02/rare-cryptocurrency.jpg",
				"title": "台銀幣價查詢",
				"text": "欲查詢其他幣種，請輸入 bot {coin}\n [範例: bot HKD]",
				"actions": [

					{
						"type": "postback",
						"label": "USD 美金",
						"data": '{"action":"bot_twb","itemid":"usd"}'
					},
					{
						"type": "postback",
						"label": "CNY 人民幣",
						"data": '{"action":"bot_twb","itemid":"cny"}'
					},
					{
						"type": "postback",
						"label": "JPY 日幣",
						"data": '{"action":"bot_twb","itemid":"jpy"}'
					}
				]
			}
		]
	}
};

var bot_polo_bitt_deprecated = {
	"type": "template",
	"altText": "P/B網查詢",
	"template": {
		"type": "buttons",
		// "thumbnailImageUrl": "https://poloniex.com/images/poloniex_icon.png",
		"title": "Poloniex & Bittrex幣價查詢",
		"text": "下列為快捷按鈕。\n 欲查詢其他幣種，請輸入 bot polo {coin}。(範例：bot polo xmr)",
		"actions": [
			{
				"type": "postback",
				"label": "ETH",
				"data": "action=bot_polo&itemid=eth"
			},
			{
				"type": "postback",
				"label": "ZEC",
				"data": "action=bot_polo&itemid=zec"
			},
			{
				"type": "postback",
				"label": "MC",
				"data": "action=bot_polo&itemid=mc"
			}
		]
	}

};

var bot_ethwallet = {
	type: 'template',
	altText: 'ETH 錢包記錄查詢',
	template: {
		type: 'buttons',
		title: 'ETH 錢包記錄查詢',
		text: '請選擇操作',
		actions: [{
			type: 'postback',
			label: '新增地址',
			data: '{"action":"bot_ethwallet_subsribe"}'
		}, {
			type: 'postback',
			label: '查詢紀錄',
			data: '{"action":"bot_ethwallet_query", "itemid":123}'
		}]
	}
};
var bot_miner = {
	type: 'template',
	altText: 'MC 錢包記錄查詢',
	template: {
		type: 'buttons',
		// thumbnailImageUrl: 'https://musicoin.org/images/thumbnail.png',
		title: 'MC 錢包記錄查詢',
		text: '請選擇操作',
		actions: [{
			type: 'postback',
			label: '新增地址',
			data: '{"action":"bot_miner_subsribe"}'
		}, {
			type: 'postback',
			label: '查詢紀錄',
			data: '{"action":"bot_miner_query"}'
		}]
	}
};

var bot_mine = {
	type: 'template',
	altText: '挖礦收益',
	template: {
		type: 'buttons',
		// thumbnailImageUrl: 'https://musicoin.org/images/thumbnail.png',
		title: '挖礦收益',
		text: '若要指定幣種，請輸入 bot mine {coin}\n  若要指定算力，請輸入 bit mine {coin} {rate}',
		actions: [{
			type: 'postback',
			label: '新增地址',
			data: '{"action":"bot_miner_subsribe"}'
		}, {
			type: 'postback',
			label: '查詢紀錄',
			data: '{"action":"bot_miner_query"}'
		}]
	}
};






// exports.HELP_MESSAGE = HELP_MESSAGE
exports.bot_coins = bot_coins
exports.bot_polo_twb = bot_polo_twb
exports.bot_ethwallet = bot_ethwallet
exports.bot_miner = bot_miner
var bot_coins = {
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
												"data": "action=botcoin&itemid=btc"
											},
											{
												"type": "postback",
												"label": "ETH",
												"data": "action=botcoin&itemid=eth"
											},
											{
												"type": "postback",
												"label": "EXP",
												"data": "action=botcoin&itemid=exp"
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
												"data": "action=botcoin&itemid=etc"
											},
											{
												"type": "postback",
												"label": "XMR",
												"data": "action=botcoin&itemid=xmr"
											},
												{
												"type": "postback",
												"label": "ZEC",
												"data": "action=botcoin&itemid=zec"
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
												"data": "action=botcoin&itemid=mc"
											},
											{
												"type": "postback",
												"label": "LTC",
												"data": "action=botcoin&itemid=ltc"
											},
											{
												"type": "postback",
												"label": "XRP",
												"data": "action=botcoin&itemid=xrp"
											}
										]
									}
								]
							}
						};
						
var bot_polo_bitt = {
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
									},
									{
										"thumbnailImageUrl": "https://cdn-images-1.medium.com/max/2000/1*uCILqG0jwJs2qjKdUviVkg.png",
										"title": "Bittrex 幣價查詢",
										"text": "下列為快捷按鈕。欲查詢其他幣種，請輸入 bot bitt {coin}。(範例：bot bitt xmr)",
										"actions": [											
											{
												"type": "postback",
												"label": "ETH",
												"data": "action=bot_bitt&itemid=eth"
											},
											{
												"type": "postback",
												"label": "ZEC",
												"data": "action=bot_bitt&itemid=zec"
											},
											{
												"type": "postback",
												"label": "MC",
												"data": "action=bot_bitt&itemid=mc"
											}
										]
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
								data: 'action=bot_ethwallet_subsribe&'
							}, {
								type: 'postback',
								label: '查詢紀錄',
								data: 'action=bot_ethwallet_query&itemid=123'
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
								data: 'action=bot_miner_subsribe'
							}, {
								type: 'postback',
								label: '查詢紀錄',
								data: 'action=bot_miner_query'
							}]
						}
					};

var HELP_MESSAGE = '[指令]\n[ 幣價查詢 ] bot coins \n[ 臺銀匯率查詢 ] bot {coin} \n[ P/B網查詢 ] bot polo/bitt {coin} \n[ 挖礦收益 ] bot mine \n[台灣MC礦池] music.gpumine.org \n[ ETH錢包紀錄查詢 ] bot ethwallet \n[ MC礦工查看 ] bot miner add 0x地址 \n[ MC礦工查看 ] bot miner \n[ FB挖礦社團 ]https://goo.gl/mB1wKV \n[ Chatbot 版本 ] version';

var BOT_BTC_MESSAGE =  '[BTC] \n[ bitoex_buy ] 83091(TWD) \n[ bitoex_sell ] 75928(TWD) \n[ maicoin_buy ] 83000.46(TWD) \n[ maicoin_price ] 76968.17(TWD) \n[ maicoin_sell ] 75946.14(TWD) \n[ btcchina ] 17700.02(CNY) \n[ huobi ] 17673(CNY) \n[ okcoin_cn ] 17640(CNY) \n[ bitfinex ] 2519.1(USD) \n[ btc-e ] 2500(USD) \n[ itbit ] 2550.61(USD) \n[ localbitcoins ] 3480.07(USD) \n[ okcoin ] 2616.03(USD) \n[ kraken ] 2238.549(EUR) \n[ TWD2CNY ] 4.497 \n[ TWD2EUR ] 34.93\n[ TWD2USD ] 30.585 2616.03(USD) \n[ kraken ] 2238.549(EUR) \n[ TWD2CNY ] 4.497 \n[ TWD2EUR ] 34.93\n[ TWD2USD ] 30.585';

var MC_MINE_MESSAGE = ' [ GPUmine Music pool ] \n[ Miner ] -> 0x6746b0b11f2c723ae85a016744481b00cb13a007\n[ Hashrate ] -> 90 MHS\n[ Penging   ] -> 36\n[ TotalPaid ] -> 4741\n [ LastPaid time ] \n2017/07/09 21:42:29\n[ LastPaid amount ] \n91.624412607\nearn/day -> 255.371\nbtc/day -> 0.002844\nusd/day -> 7.2\n ntd/day -> 216.99\n[ worker ] -> 2 / 0\n[ lastshare ] -> 2017/07/10 00:31:46 \n HARDCODE FOR TEST\n'



	
exports.HELP_MESSAGE = HELP_MESSAGE
exports.bot_coins = bot_coins
exports.bot_polo_bitt = bot_polo_bitt
exports.bot_ethwallet = bot_ethwallet
exports.bot_miner = bot_miner
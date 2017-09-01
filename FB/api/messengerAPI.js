var config = require('config')
var request = require('request')

const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

var getStartedOptions = {
  method: 'POST',
   url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
  qs: { access_token: PAGE_ACCESS_TOKEN },
  headers: { 'content-type': 'application/json' },
  body: {
    "get_started":{
      "payload":"GET_STARTED_PAYLOAD"
    }
  },
  json: true
}


/* set up whitelist domains */
var whiteListOptions = { 
  method: 'POST',
  url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
  qs: { access_token: PAGE_ACCESS_TOKEN },
  headers: { 'content-type': 'application/json' },
  body: 
   { whitelisted_domains: 
      [ 
        'https://raw.githubusercontent.com/',
      'https://i.imgur.com/',
      'https://themerkle.com/' ] },
  json: true 
};



var persistentMenuOptions = {
  method: 'POST',
  url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
  qs: { access_token: PAGE_ACCESS_TOKEN },
  headers: { 'content-type': 'application/json' },
  body:
  {    
    "persistent_menu":[
      {
        "locale":"default",
        "composer_input_disabled":false,
        "call_to_actions":[
          {
            "title":"幣價查詢",
            "type":"nested",
            "call_to_actions":[
              {
                "title":"BTC / ALTCOIN 查詢",
                "type":"postback",
                "payload":"bot_coins_PAYLOAD"
              },
              {
                "title":"Poloniex 查詢",
                "type":"postback",
                "payload":"bot_polo_PAYLOAD"
              },
              {
                "title":"台銀幣價查詢",
                "type":"postback",
                "payload":"bot_twb_PAYLOAD"
              }
            ]
          },
          {
            "title":"挖礦收益",
            "type":"nested",
            "call_to_actions":[
              {
                "title":"收益總覽",
                "type":"postback",
                "payload":"bot_mine"
              }
            ]        
          },          
          {
            "title":"錢包查詢 / 其他",
            "type":"nested",
            "call_to_actions":[
              {
                "title":"ETH錢包查詢",
                "type":"postback",
                "payload":"bot_ethwallet_PAYLOAD"
              },
              {
                "title":"MC礦工查詢",
                "type":"postback",
                "payload":"bot_miner_PAYLOAD"
              },
              {
                "title":"HELP",
                "type":"postback",
                "payload":"bot_help"
              }
            ]
          }
          
        ]
      },
      {
        "locale":"zh_CN",
        "composer_input_disabled":false
      }
    ]
    
  },  
  json: true,
}

var greetingOption = {
  method: 'POST',
  url: 'https://graph.facebook.com/v2.6/me/thread_settings',
  qs: { access_token: PAGE_ACCESS_TOKEN },
  headers: { 'content-type': 'application/json' },
  body: { 
      "setting_type":"greeting",
      "greeting":{
      "text":"早安我的朋友，{{user_full_name}}！"
       }
    },
  json: true 
   
};

function init(){
    sendRequest(getStartedOptions);
    sendRequest(whiteListOptions);
    sendRequest(persistentMenuOptions);
    sendRequest(greetingOption);

}


function sendRequest(options){
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(options.url,body);
    });
}

exports.init = init
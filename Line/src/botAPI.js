var request = require('request');
var callback_state = {
	'eth_wallet_subsribe_state': false,
	'mc_mine_subsribe_state': false
}
function event_callback(event, postback_data){
    var chat_id = event.source.userId;
    try{
        var obj = JSON.parse(postback_data);
        console.log(obj);
        if(obj['action'] == 'bot_polo'){
            // bot polo callback
            callAPI('polo', {'coin': obj['itemid'],'usersay':'bot polo callback event', 'channel':'line', 'callerid': chat_id}, event);
        }
        else if(obj['action'] == 'bot_twb'){
            // bot twb callback
            callAPI('currency', {'coin': obj['itemid'],'usersay':'bot currency callback event', 'channel':'line', 'callerid': chat_id}, event);
        }
        else if(obj['action'] == 'bot_ethwallet_subsribe'){
            callback_state['eth_wallet_subsribe_state'] = true;
            event.reply('請新增地址');
        }
        else if(obj['action'] == 'bot_miner_subsribe'){
            callback_state['mc_mine_subsribe_state'] = true;
            event.reply('請新增地址');
        }
        else if(obj['action'] == 'bot_miner_query'){
            getAddress('miner', {'coin': 'mc', 'channel': 'line', 'callerid': chat_id}, event);
        }
        else if(obj['action'] == 'bot_ethwallet_query'){
            getAddress('miner', {'coin': 'eth', 'channel': 'line', 'callerid': chat_id}, event);
        }
        else if(obj['action'] == 'bot_coins'){
            callAPI('coin', {'coin': obj['itemid'],'usersay':'bot coin callback event', 'channel':'line', 'callerid': chat_id}, event);
        }


    }
    catch(e){
        console.log(e);
    }
    // console.log(callback_state);
    return callback_state;
   
  
    
}

function getAddress(target, data, event){
    var options = {
        method: 'POST',
        url: 'http://150.95.147.150:3000/' + target + '/getAddress',
        json: data
    };
    function callback(error, response, body) {
        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            console.log(body);
            var addr = body['ans'].split(" ");
            if(addr.length == 3){
                data['address'] = addr[2];
            }
            callAPI(target + '/status', data, event);
        }
    }   
    request(options, callback); 
}

function callAPI(target, data, event){
    var options = {
        method: 'POST',
        url: 'http://150.95.147.150:3000/' + target,
        json: data
    };
    function callback(error, response, body) {
        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            console.log(body);
          event.reply(body['ans']);
        }
    }   
    request(options, callback); 
    
}
exports.event_callback = event_callback
exports.callAPI = callAPI

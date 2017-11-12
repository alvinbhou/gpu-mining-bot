const request = require('request');
const message_data = require('../models/messageData');
const config = require('config');
const PAGE_ACCESS_TOKEN = config.get('pageAccessToken');
var callback_state = {
	'eth_wallet_subsribe_state': false,
	'mc_mine_subsribe_state': false
}

/*
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

    }
    catch(e){
        console.log(e);
    }
    // console.log(callback_state);
    return callback_state;
   
  
    
}
*/
function getAddress(target, data){
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
            callBot2SendAPI(target + '/status', data);
        }
    }   
    request(options, callback); 
}

function callAPI(target, data){
    var options = {
        method: 'POST',
        url: 'http://150.95.147.150:3000/' + target,
        json: data
    };
    function callback(error, response, body) {
        // console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
          return body['ans'];
        }
    }   
    request(options, callback); 
    
}

function callBot2SendAPI(target, data) {
    var options = {
        method: 'POST',
        url: 'http://150.95.147.150:3000/' + target,
        json: data
    };
    function callback(error, response, body) {
        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            console.log(body['ans']);
            var firstString, idx;
            var secondString;
            if(body['ans'].length >= 640){
                for (var i = 0; i < 640; ++i){
                    if(body['ans'][i] == '\n'){
                        idx = i;
                    }
                }
                prevString= body['ans'].substring(0,idx);
                secondString = body['ans'].substring(idx,);
                callSendAPI(message_data.TextMessage(data.callerid, prevString));
                setTimeout(function() {
                    callSendAPI(message_data.TextMessage(data.callerid, secondString));
                }, 500)  
            }
            else{
                callSendAPI(message_data.TextMessage(data.callerid, body['ans']));
            }
            
        }
        else{
            console.log(response.statusCode);
        }
    }   
    request(options, callback); 
    
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
            console.log("Successfully sent message to recipient [%s]", 
            recipientId);
        } else {
            console.log("Successfully called Send API for recipient [%s]", 
        recipientId);
        }
    } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
    });  
}

// exports.event_callback = event_callback
// exports.callAPI = callAPI
exports.callSendAPI = callSendAPI
exports.callBot2SendAPI = callBot2SendAPI
exports.getAddress = getAddress

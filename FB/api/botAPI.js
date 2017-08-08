const request = require('request');
const config = require('config');
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');
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

// function callAPI(target, data, event){
//     var options = {
//         method: 'POST',
//         url: 'http://150.95.147.150:3000/' + target,
//         json: data
//     };
//     function callback(error, response, body) {
//         // console.log(response.statusCode);
//         if (!error && response.statusCode == 200) {
//           event.reply(body['ans']);
//         }
//     }   
//     request(options, callback); 
    
// }*/

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

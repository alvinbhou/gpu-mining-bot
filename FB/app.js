'use strict';

const 
    bodyParser = require('body-parser'),
    config = require('config'),
    crypto = require('crypto'),
    express = require('express'),
    https = require('https'),  
    request = require('request'),
    fs = require('fs'),
    http = require('http'),
    message_data = require('./models/messageData'),
    messenger_settings = require('./api/messengerAPI'),
    bot_api = require('./api/botAPI'),
    parse_helper = require('./helpers/parse');

const ALTCOINS = ['ETH','EXP', 'ETC', 'XMR', 'ZEC', 'MC', 'LTC', 'XRP'];
const TWBCOINS = ['USD','CNY', 'HKD','JPY', 'GBP', 'AUD', 'CAD' , 'SGD', 'CHF', 'ZAR', 'SEK', 'NZD', 'THB', 'PHP', 'IDR', 'EUR', 'KRW', 'VND', 'MYR']

const CHANNEL = 'FB';
var COINS_DATA = {
	'BTC': ''
};

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

// init messenger_settings
messenger_settings.init();

/*
 * Be sure to setup your config values before running this code. You can 
 * set them using environment variables or modifying the config file in /config.
 *
 */

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = config.get('appSecret');
// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN =  config.get('validationToken');
// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN =   config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and 
// assets located at this address. 
const SERVER_URL = config.get('serverURL');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
    console.error("Missing config values");
    process.exit(1);
}

const BOT_STATE ={};



/*
 * Use your own validation token. Check that the token used in the Webhook 
 * setup is the same token used here.
 *
 */
app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);          
    }  
});


/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
            if (messagingEvent.optin) {
                receivedAuthentication(messagingEvent);
            } else if (messagingEvent.message) {
                receivedMessage(messagingEvent);
            } else if (messagingEvent.delivery) {
                (messagingEvent);
            } else if (messagingEvent.postback) {
                receivedPostback(messagingEvent);
            } else if (messagingEvent.read) {
                receivedMessageRead(messagingEvent);
            } else if (messagingEvent.account_linking) {
                receivedAccountLink(messagingEvent);
            } else {
                console.log("Webhook received unknown messagingEvent: ", messagingEvent);
            }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've 
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL. 
 * 
 */
app.get('/authorize', function(req, res) {
    var accountLinkingToken = req.query.account_linking_token;
    var redirectURI = req.query.redirect_uri;

    // Authorization Code should be generated per user by the developer. This will 
    // be passed to the Account Linking callback.
    var authCode = "1234567890";

    // Redirect users to this URI on successful login
    var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

    res.render('authorize', {
        accountLinkingToken: accountLinkingToken,
        redirectURI: redirectURI,
        redirectURISuccess: redirectURISuccess
    });
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from 
 * the App Dashboard, we can verify the signature that is sent with each 
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        // For testing, let's log an error. In production, you should throw an 
        // error.
        console.error("Couldn't validate the signature.");
        } else {
        var elements = signature.split('=');
        var method = elements[0];
        var signatureHash = elements[1];

        var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                            .update(buf)
                            .digest('hex');

        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to 
 * Messenger" plugin, it is the 'data-ref' field. Read more at 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfAuth = event.timestamp;

    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the 
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger' 
    // plugin.
    var passThroughParam = event.optin.ref;

    console.log("Received authentication for user %d and page %d with pass " +
        "through param '%s' at %d", senderID, recipientID, passThroughParam, 
        timeOfAuth);

    // When an authentication is received, we'll send a message back to the sender
    // to let them know it was successful.
    bot_api.callSendAPI(message_data.TextMessage(senderID, "Authentication successful"));
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message' 
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some 
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've 
 * created. If we receive a message with an attachment (image, video, audio), 
 * then we'll simply confirm that we've received the attachment.
 * 
 */
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  console.log('[Recieved Message]')
  console.log('-- Recieved Message from [%d] to [%d]', senderID, recipientID);
  // console.log("SenderID  and recipientID %d at Time: %d with message:", senderID, recipientID, timeOfMessage);
  console.log('-- Recieved message:',message.text ); 
  


  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var msg = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    // console.log("Received echo for message {%s}", 
    //   messageId);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message {%s} with payload {%s}",
        messageId, quickReplyPayload);
    if(quickReply.payload.includes('bot_ethwallet_')){
        if(quickReply.payload.includes('bot_ethwallet_subsribe')){
            BOT_STATE[senderID] = {};
            BOT_STATE[senderID]['eth_wallet_subsribe_state'] = true;
            bot_api.callSendAPI(message_data.TextMessage(senderID,'請新增地址'));
        }
        else if(quickReply.payload.includes('bot_ethwallet_query')){
            bot_api.getAddress('miner', {'coin': 'eth', 'channel': 'FB', 'callerid': senderID});
        }
    }
    else if(quickReply.payload.includes('bot_miner_')){
        if(quickReply.payload.includes('bot_miner_subsribe')){
            BOT_STATE[senderID] = {};
            BOT_STATE[senderID]['bot_miner_subsribe_state'] = true;
            bot_api.callSendAPI(message_data.TextMessage(senderID,'請新增地址'));
        }
        else if(quickReply.payload.includes('bot_miner_query')){
            bot_api.getAddress('miner', {'coin': 'mc', 'channel': 'FB', 'callerid': senderID});
        }
    }
    else{
        var postParas =  parse_helper.getPOSTPara(quickReplyPayload, senderID);
        console.log(postParas);
        if(postParas){
            // console.log('hi');
            bot_api.callBot2SendAPI(postParas[0],postParas[1]);
        }
    }
 
    


    // bot_api.callSendAPI(message_data.TextMessage(senderID, "Quick reply tapped"));
    return;
  }

    if (msg) {
        // typing on
        bot_api.callSendAPI(message_data.TypingOn(senderID));
        console.log(BOT_STATE);
        if(BOT_STATE.hasOwnProperty(senderID)){
            console.log(BOT_STATE[senderID].eth_wallet_subsribe_state);
            if((BOT_STATE[senderID].eth_wallet_subsribe_state) == true){
                if(isValidEthAddress(msg)){
                    bot_api.callBot2SendAPI('miner/subscribe', {'coin': 'eth', 'address': msg,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
                }
                else{               
                    bot_api.callSendAPI(message_data.TextMessage(senderID,'不合法地址'));
                }
                delete BOT_STATE[senderID];
            }
            if((BOT_STATE[senderID].bot_miner_subsribe_state) == true){
                if(isValidEthAddress(msg)){
                    bot_api.callBot2SendAPI('miner/subscribe', {'coin': 'mc', 'address': msg,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
                }
                else{               
                    bot_api.callSendAPI(message_data.TextMessage(senderID,'不合法地址'));
                }
                delete BOT_STATE[senderID];
            }
            
            return;
        }
        


        var orginal_msg = msg;
        msg = msg.toLowerCase();
        if (msg == 'me'){
           
        }
        else if(msg.includes('help')){
            bot_api.callBot2SendAPI('help', {'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
        }
        else if(msg == 'bot coins'){
            // event.reply(['請選擇要查詢的幣種', message_objects.bot_coins]);
        }
        else if(msg == 'bot mine'){
            bot_api.callBot2SendAPI('mine',{'usersay': msg, 'channel': 'FB', 'callerid': senderID});
            // bot_API.callAPI('mine', {'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
        }
      
        else if(msg == 'p網/台銀幣價查詢' || msg =="bot polo"){
            var msg = parse_helper.parsePayload('bot_polo', senderID);
            bot_api.callSendAPI(msg);
            // event.reply(message_objects.bot_polo_twb);
        }
        else if(msg =='bot ethwallet'){
            // event.reply(message_objects.bot_ethwallet);
        }
        else if(msg == 'bot miner'){
            // event.reply(message_objects.bot_miner);
        }
        else if(msg == 'version'){
            // event.reply('目前chatbot版本為' + require('../package.json').version);
        }
        else if(msg.substring(0,9) == 'bot polo '){
            // bot polo
            var coin = msg.substring(9,msg.length);
            bot_api.callBot2SendAPI('polo', {'coin': coin,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
        }
        else if(msg.substring(0,9) == 'bot mine '){
            // bot mine
            var cmd = msg.substring(9,msg.length).split(" ");
        
            if(cmd.length == 1){
                console.log(cmd);
                var coin = cmd[0];
                bot_api.callBot2SendAPI('mine', {'coin': coin,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
            }
            else if(cmd.length == 2){
                var coin = cmd[0];
                var hashrate = cmd[1];
                console.log(coin, hashrate);
                bot_api.callBot2SendAPI('mine', {'hashrate': hashrate, 'coin': coin,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
            }
        }
        else if(msg.substring(0,18) == 'bot ethwallet add '){
            var addr = orginal_msg.substring(18,orginal_msg.length);
            console.log(addr);
            if(isValidEthAddress(addr)){
                
                bot_api.callBot2SendAPI('miner/subscribe', {'coin': 'eth', 'address': addr,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
            }
            else{
                bot_api.callSendAPI(message_data.TextMessage(senderID,'不合法地址'));
            }

        }
        else if(msg == 'bot ethwallet'){
            bot_api.getAddress('miner', {'coin': 'eth', 'channel': 'FB', 'callerid': senderID});
        }
        else if(msg.substring(0,14) == 'bot miner add '){
            var addr = orginal_msg.substring(14,orginal_msg.length);
            console.log(addr);
            if(isValidEthAddress(addr)){
                
                bot_api.callBot2SendAPI('miner/subscribe', {'coin': 'mc', 'address': addr,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
            }
            else{
                bot_api.callSendAPI(message_data.TextMessage(senderID,'不合法地址'));
            }
        }
        else if(msg == 'bot miner'){
            bot_api.getAddress('miner', {'coin': 'mc', 'channel': 'FB', 'callerid': senderID});
        }
        else if(msg.substring(0,4) == 'bot '){
            var coin = msg.substring(4,msg.length)
            console.log(coin);
            // Altcoins
            for(var i = 0; i < ALTCOINS.length; ++i){					
                if(coin ==  ALTCOINS[i].toLowerCase() || coin == 'btc'){						
                    bot_api.callBot2SendAPI('coin', {'coin': coin,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
                    break;	
                }
            }
            // TWB coins
            for(var i = 0; i < TWBCOINS.length; ++i){
                if(coin ==  TWBCOINS[i].toLowerCase()){						
                    bot_api.callBot2SendAPI('currency', {'coin': coin,'usersay': msg, 'channel': CHANNEL, 'callerid': senderID});
                    break;	
                }
            }
        }
      
        else{
            bot_api.callSendAPI(message_data.TextMessage(senderID,'您好，請問您需要什麼服務？'));
        }

        // If we receive a text message, check to see if it matches any special
        // keywords and send back the corresponding example. Otherwise, just echo
        // the text we received.
        switch (msg) {
            case 'image':
                bot_api.callSendAPI(message_data.ImageMessage(senderID));
            break;

            case 'gif':
                bot_api.callSendAPI(message_data.GifMessage(senderID));
            break;

            case 'audio':
                bot_api.callSendAPI(message_data.AudioMessage(senderID));
            break;

            case 'video':
                bot_api.callSendAPI(message_data.VideoMessage(senderID));
            break;

            case 'file':
                bot_api.callSendAPI(message_data.FileMessage(senderID));
            break;

            case 'button':
                bot_api.callSendAPI(message_data.ButtonMessage(senderID));
            break;

            case 'generic':
                bot_api.callSendAPI(message_data.GenericMessage(senderID));
            break;

            case 'receipt':
                bot_api.callSendAPI(message_data.ReceiptMessage(senderID));
            break;

            case 'quick reply':
                bot_api.callSendAPI(message_data.QuickReply(senderID));
            break;        

            case 'read receipt':
                bot_api.callSendAPI(message_data.ReadReceipt(senderID));
            break;        

            case 'typing on':
                bot_api.callSendAPI(message_data.TypingOn(senderID));
            break;        

            case 'typing off':
                bot_api.callSendAPI(message_data.TypingOff(senderID));
            break;        

            case 'account linking':
                bot_api.callSendAPI(message_data.AccountLinking(senderID));
            break;

            case 'list':
                bot_api.callSendAPI(message_data.ListTemplate(senderID));
            break;

            // default:        
            //     bot_api.callSendAPI(message_data.TextMessage(senderID, msg));
    }
  } else if (messageAttachments) {
      bot_api.callSendAPI(message_data.TextMessage(senderID, "Message with attachment received"));
  }
}


/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about 
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var delivery = event.delivery;
    var messageIDs = delivery.mids;
    var watermark = delivery.watermark;
    var sequenceNumber = delivery.seq;

  // if (messageIDs) {
  //   messageIDs.forEach(function(messageID) {
  //     console.log("Received delivery confirmation for message ID: %s", 
  //       messageID);
  //   });
  // }

  // console.log("All message before %d were delivered.", watermark);
}


/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured else if(msg.substring(0,9) == 'bot polo '){
				// bot polo
				var coin = msg.substring(9,msg.length);
				bot_API.callAPI('polo', {'coin': coin,'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
			}
			else if(msg.substring(0,9) == 'bot mine '){
				// bot mine
				var cmd = msg.substring(9,msg.length).split(" ");
			
				if(cmd.length == 1){
					console.log(cmd);
					var coin = cmd[0];
					bot_API.callAPI('mine', {'coin': coin,'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
				}
				else if(cmd.length == 2){
					var coin = cmd[0];
					var hashrate = cmd[1];
					bot_API.callAPI('mine', {'hashrate': hashrate, 'coin': coin,'usersay': msg, 'channel': CHANNEL, 'callerid': chat_id}, event);
				}
			}
			else if(msg.substring(0,4) == 'bot '){
				var coin = msg.substring(4,msg.length)
				// Altcoins
				for(var i = 0; i < ALTCOINS.length; ++i){					
					if(coin ==  ALTCOINS[i].toLowerCase()){						
						bMessage. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback 
    // button for Structured Messages. 
    var payload = event.postback.payload;
 

    console.log("Received  **POSTBACK** for user %d with payload '%s' ", senderID,  payload);
    

    // When a postback is called, we'll send a message back to the sender to 
    // let them know it was successful

    // If includes '_PAYLOAD',  this postback payload should reply self-defined actions
    // or menu options (not API involded)
    if(payload.includes('_PAYLOAD')){
        var msg = parse_helper.parsePayload(payload, senderID);
        bot_api.callSendAPI(msg);
    }   
    // callbacks to trigger API to reply
    else if(payload.includes('_APICALL')){
        var postParas =  parse_helper.getPOSTPara(payload.replace('_APICALL', ''), senderID);
        console.log("PostParas", postParas);
        if(postParas){           
            bot_api.callBot2SendAPI(postParas[0],postParas[1]);
        }
        
    }
    else{
        bot_api.callSendAPI(message_data.TextMessage(senderID, payload + " Postback called"));
    }
  
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 * 
 */
function receivedMessageRead(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    // All messages before watermark (a timestamp) or sequence have been seen.
    var watermark = event.read.watermark;
    var sequenceNumber = event.read.seq;

  // console.log("Received message read event for watermark {%d} and sequence " +
  //   "number %d", watermark, sequenceNumber);
}

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 * 
 */
function receivedAccountLink(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;

  var status = event.account_linking.status;
  var authCode = event.account_linking.authorization_code;

  console.log("Received account link event with for user %d with status %s " +
    "and auth code %s ", senderID, status, authCode);
}

function getCoinInfo(params) {
	for(var i = 0; i < ALTCOINS.length; ++i){
		bot_API.callAPI(ALTCOINS[i], 'bot update coin info', COINS_DATA);
	}
}

function isValidEthAddress(addr){
    if((addr).length != 42){
		return false;
	}        
    if(addr.substring(0,2) != '0x'){
		return false;
	}
	if(/^\w+$/.test(addr)){
		return true;
	}       
    else{
		return false;
	}
}


// Start server
// Webhooks must be available via SSL with a certificate signed by a valid 
// certificate authority.
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);
parse_helper
// httpServer.listen(8877);
// httpsServer.listen(8443);
module.exports = app;


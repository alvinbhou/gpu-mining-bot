const config = require('config');
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

function bot_coins(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: "請選擇要查詢的幣種",
      quick_replies: [
        {
          "content_type":"text",
          "title":"BTC",
          "payload":"bot_btc",
          "image_url": "https://i.imgur.com/PXxMF79.png"
        },
        {
          "content_type":"text",
          "title":"ETH",
          "payload":"bot_coin_eth",
          "image_url": "https://i.imgur.com/sro5Ro3.png"
        },
        {
          "content_type":"text",
          "title":"ZEC",
          "payload":"bot_coin_zec",
          "image_url": "https://i.imgur.com/ACsoHNv.png"
        },
        {
          "content_type":"text",
          "title":"MC",
          "payload":"bot_coin_mc",
          "image_url": "https://i.imgur.com/a4F8Y1n.png"
        },
        {
          "content_type":"text",
          "title":"LTC",
          "payload":"bot_coin_ltc",
          "image_url": "https://i.imgur.com/IJj18do.png"
        }, 
        {
          "content_type":"text",
          "title":"ETC",
          "payload":"bot_coin_etc",
          "image_url": "https://i.imgur.com/xigNgWh.png"
        },
        {
          "content_type":"text",
          "title":"EXP",
          "payload":"bot_coin_exp",
          "image_url": "https://i.imgur.com/gO2C25u.png"
        },
        {
          "content_type":"text",
          "title":"XMR",
          "payload":"bot_coin_xmr",
           "image_url": "https://i.imgur.com/LRrbIz7.png"
          
        },
        {
          "content_type":"text",
          "title":"XRP",
          "payload":"bot_coin_xrp",
          "image_url": "https://i.imgur.com/mksbGzl.png"
        }
      ]
    }
  };  
}

function bot_polo(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: "[Poloniex / Bittrex]\n欲查詢其他幣種，請輸入 bot polo {coin}\n [範例: bot polo dash]",
      quick_replies: [
        {
          "content_type":"text",
          "title":"BTC",
          "payload":"bot_polo_btc",
          "image_url": "https://i.imgur.com/PXxMF79.png"
        },
        {
          "content_type":"text",
          "title":"ETH",
          "payload":"bot_polo_eth",
          "image_url": "https://i.imgur.com/sro5Ro3.png"
        },
        {
          "content_type":"text",
          "title":"ZEC",
          "payload":"bot_polo_zec",
          "image_url": "https://i.imgur.com/ACsoHNv.png"
        },
        {
          "content_type":"text",
          "title":"MC",
          "payload":"bot_polo_mc",
          "image_url": "https://i.imgur.com/a4F8Y1n.png"
        },
        {
          "content_type":"text",
          "title":"LTC",
          "payload":"bot_polo_ltc",
          "image_url": "https://i.imgur.com/IJj18do.png"
        }, 
        {
          "content_type":"text",
          "title":"ETC",
          "payload":"bot_polo_etc",
          "image_url": "https://i.imgur.com/xigNgWh.png"
        },
        {
          "content_type":"text",
          "title":"EXP",
          "payload":"bot_polo_exp",
          "image_url": "https://i.imgur.com/gO2C25u.png"
        },
        {
          "content_type":"text",
          "title":"XMR",
          "payload":"bot_polo_xmr",
           "image_url": "https://i.imgur.com/LRrbIz7.png"
          
        },
        {
          "content_type":"text",
          "title":"XRP",
          "payload":"bot_polo_xrp",
          "image_url": "https://i.imgur.com/mksbGzl.png"
        }
      ]
    }
  };  
}

function bot_twb(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: "台銀幣價查詢\n欲查詢其他幣種，請輸入 bot {coin}\n [範例: bot HKD]",
      quick_replies: [
        {
          "content_type":"text",
          "title":"USD",
          "payload":"bot_twb_usd",
        },
        {
          "content_type":"text",
          "title":"CNY",
          "payload":"bot_twb_cny",
        },
        {
          "content_type":"text",
          "title":"HKD",
          "payload":"bot_twb_hkd",
        },
        {
          "content_type":"text",
          "title":"JPY",
          "payload":"bot_twb_jpy",
        },
        {
          "content_type":"text",
          "title":"GBP",
          "payload":"bot_twb_gbp",
        }, 
        {
          "content_type":"text",
          "title":"AUD",
          "payload":"bot_twb_aud",
        }
      ]
    }
  };  
}

exports.bot_coins = bot_coins
exports.bot_polo = bot_polo
exports.bot_twb = bot_twb


exports.AccountLinking = AccountLinking
exports.AudioMessage = AudioMessage
exports.ButtonMessage = ButtonMessage
exports.ImageMessage = ImageMessage
exports.VideoMessage = VideoMessage
exports.FileMessage
exports.GenericMessage = GenericMessage
exports.GifMessage = GifMessage
exports.QuickReply = QuickReply
exports.TypingOff = TypingOff
exports.TypingOn = TypingOn
exports.TextMessage = TextMessage
exports.ReadReceipt = ReadReceipt
exports.ReceiptMessage = ReceiptMessage
exports.ListMessage = ListMessage
exports.ListTemplate = ListTemplate


/*
 *
 * 
 *  Template Message Objects
 * 
 * 
 */

/*
 * Send an image using the Send API.
 *
 */
function ImageMessage(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + "/assets/rift.png"
        }
      }
    }
  };

  
}

/*
 * Send a Gif using the Send API.
 *
 */
function GifMessage(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + "/assets/instagram_logo.gif"
        }
      }
    }
  };

  
}

/*
 * Send audio using the Send API.
 *
 */
function AudioMessage(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "audio",
        payload: {
          url: SERVER_URL + "/assets/sample.mp3"
        }
      }
    }
  };

  
}

/*
 * Send a video using the Send API.
 *
 */
function VideoMessage(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          url: SERVER_URL + "/assets/allofus480.mov"
        }
      }
    }
  };

  
}

/*
 * Send a file using the Send API.
 *
 */
function FileMessage(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "file",
        payload: {
          url: SERVER_URL + "/assets/test.txt"
        }
      }
    }
  };

  
}

/*
 * Send a text message using the Send API.
 *
 */
function TextMessage(recipientId, messageText) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text:  messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };
//   console.log(messageData);

  
}

/*
 * Send a button message using the Send API.
 *
 */
function ButtonMessage(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "This is test text",
          buttons:[{
            type: "web_url",
            url: "https://www.oculus.com/en-us/rift/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Trigger Postback",
            payload: "DEVELOPER_DEFINED_PAYLOAD"
          }, {
            type: "phone_number",
            title: "Call Phone Number",
            payload: "+16505551234"
          }]
        }
      }
    }
  };  

  
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function GenericMessage(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: SERVER_URL + "/assets/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: SERVER_URL + "/assets/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  
}

/*
 * Send a receipt message using the Send API.
 *
 */
function ReceiptMessage(recipientId) {
  // Generate a random receipt ID as the API requires a unique ID
  var receiptId = "order" + Math.floor(Math.random()*1000);

  return {
    recipient: {
      id: recipientId
    },
    message:{
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: "Peter Chang",
          order_number: receiptId,
          currency: "USD",
          payment_method: "Visa 1234",        
          timestamp: "1428444852", 
          elements: [{
            title: "Oculus Rift",
            subtitle: "Includes: headset, sensor, remote",
            quantity: 1,
            price: 599.00,
            currency: "USD",
            image_url: SERVER_URL + "/assets/riftsq.png"
          }, {
            title: "Samsung Gear VR",
            subtitle: "Frost White",
            quantity: 1,
            price: 99.99,
            currency: "USD",
            image_url: SERVER_URL + "/assets/gearvrsq.png"
          }],
          address: {
            street_1: "1 Hacker Way",
            street_2: "",
            city: "Menlo Park",
            postal_code: "94025",
            state: "CA",
            country: "US"
          },
          summary: {
            subtotal: 698.99,
            shipping_cost: 20.00,
            total_tax: 57.67,
            total_cost: 626.66
          },
          adjustments: [{
            name: "New Customer Discount",
            amount: -50
          }, {
            name: "$100 Off Coupon",
            amount: -100
          }]
        }
      }
    }
  };

  
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function QuickReply(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: "What's your favorite movie genre?",
      quick_replies: [
        {
          "content_type":"text",
          "title":"Action",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        },
        {
          "content_type":"text",
          "title":"Comedy",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        },
        {
          "content_type":"text",
          "title":"Drama",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        },
        {
          "content_type":"text",
          "title":"Drama2",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        },
        {
          "content_type":"text",
          "title":"Drama3",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        }
      ]
    }
  };  
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function ReadReceipt(recipientId) {
  // console.log("Sending a read receipt to mark message as seen");

  return {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  
}

/*
 * Turn typing indicator on
 *
 */
function TypingOn(recipientId) {
  // console.log("Turning typing indicator on");

  return {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  
}

/*
 * Turn typing indicator off
 *
 */
function TypingOff(recipientId) {
  console.log("Turning typing indicator off");

  return {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  
}

/*
 * Send a message with the account linking call-to-action
 *
 */
function AccountLinking(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Welcome. Link your account.",
          buttons:[{
            type: "account_link",
            url: SERVER_URL + "/authorize"
          }]
        }
      }
    }
  };  

  
}

function ListMessage(recipientId){
    return {
        "recipient":{
            "id": recipientId
        }, "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "elements": [
                        {
                            "title": "Classic White T-Shirt",
                            "image_url":  "https://i.imgur.com/Igi7KgR.jpg",
                            "subtitle": "100% Cotton, 200% Comfortable",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"
                            },
                            "buttons": [
                                {
                                    "title": "Buy",
                                    "type": "web_url",
                                    "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"                        
                                }
                            ]                
                        },
                        {
                            "title": "Classic Blue T-Shirt",
                            "image_url":  SERVER_URL + "/assets/rift.png",
                            "subtitle": "100% Cotton, 200% Comfortable",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"
                            },
                            "buttons": [
                                {
                                    "title": "Buy",
                                    "type": "web_url",
                                    "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"                        
                                }
                            ]                
                        },
                        {
                            "title": "Classic Black T-Shirt",
                            "image_url":  SERVER_URL + "/assets/rift.png",
                            "subtitle": "100% Cotton, 200% Comfortable",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"
                            },
                            "buttons": [
                                {
                                    "title": "Buy",
                                    "type": "web_url",
                                    "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"                        
                                }
                            ]                
                        },
                        {
                            "title": "Classic Gray T-Shirt",
                            "image_url":  SERVER_URL + "/assets/rift.png",
                            "subtitle": "100% Cotton, 200% Comfortable",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"
                            },
                            "buttons": [
                                {
                                    "title": "Buy",
                                    "type": "web_url",
                                    "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"                        
                                }
                            ]                
                        }
                    ],
                    "buttons": [
                        {
                            "title": "View More",
                            "type": "postback",
                            "payload": "payload"                        
                        }
                    ]  
                }
            }
        }
   };
      

}

function ListTemplate(recipientId){
    return {
        "recipient":{
            "id": recipientId
        }, "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "elements": [
                        {
                            "title": "Classic White T-Shirt",
                            "image_url":  "https://themerkle.com/wp-content/uploads/2017/02/rare-cryptocurrency.jpg",
                            "subtitle": "BTC",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"
                            },
                            "buttons": [
                                {
                                    "title": "Buy",
                                    "type": "web_url",
                                    "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"                        
                                }
                            ]                
                        },
                         {
                            "title": "Classic Blue T-Shirt",
                            "image_url":  SERVER_URL + "/assets/rift.png",
                            "subtitle": "100% Cotton, 200% Comfortable",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                "messenger_extensions": true,
                                "webview_height_ratio": "tall",
                                "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"
                            },
                            "buttons": [
                                {
                                    "title": "Buy",
                                    "type": "web_url",
                                    "url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://raw.githubusercontent.com/shphrd/crypto-icons/master/color-icons/png/%401x/Bitcoin.png"                        
                                }
                            ]                
                        },
                        
                    ],
                    "buttons": [
                        {
                            "title": "View More",
                            "type": "postback",
                            "payload": "payload"                        
                        }
                    ]  
                }
            }
        }
   };
      

}


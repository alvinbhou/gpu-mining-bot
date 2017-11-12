const message_data = require('../models/messageData')


function getPOSTPara(payload, senderID) {
    if(payload.includes('bot_coin_')){
        var coin = payload.substring(9,payload.length);
        return ['coin', {'coin': coin,'usersay': payload, 'channel': 'FB', 'callerid': senderID}];
    }
    else if(payload.includes('bot_polo_')){
        var coin = payload.substring(9,payload.length);
        return ['polo', {'coin': coin,'usersay': payload, 'channel': 'FB', 'callerid': senderID}];
    }
    else if(payload.includes('bot_twb_')){
        var coin = payload.substring(8,payload.length);
        return ['currency', {'coin': coin,'usersay': payload, 'channel': 'FB', 'callerid': senderID}];
    }
    else if(payload.includes('bot_help')){
        return ['help', {'usersay': 'bot_help', 'channel':'FB', 'callerid': senderID}];
    }
    else if(payload == 'bot_mine_all'){
        return ['mine', {'usersay': payload, 'channel': 'FB', 'callerid': senderID}];
    }
   

}


function parsePayload(payload, senderID){
    var cmd = payload.replace('_PAYLOAD', '');
    if(cmd == 'GET_STARTED'){
        return message_data.TextMessage(senderID, '歡迎！您好，請問您需要什麼服務？ 若不清楚隨時輸入 help 查詢指令！');
    }
    else if(cmd == 'bot_coins'){
        return message_data.bot_coins(senderID);
    }
    else if(cmd == 'bot_polo'){
        return message_data.bot_polo(senderID);
    }
    else if(cmd == 'bot_twb'){
        return message_data.bot_twb(senderID);
    }
    else if(cmd == 'bot_ethwallet'){
        return message_data.bot_ethwallet(senderID);
    }
    else if(cmd == 'bot_miner'){
        return message_data.bot_mcminer(senderID);
    }
    
    
    


}
exports.getPOSTPara = getPOSTPara
exports.parsePayload = parsePayload
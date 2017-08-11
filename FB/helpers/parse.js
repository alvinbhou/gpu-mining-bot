function getPOSTPara(payload, senderID) {
    if(payload.includes('bot_coin_')){
        var coin = payload.substring(9,payload.length);
        return ['coin', {'coin': coin,'usersay': payload, 'channel': 'FB', 'callerid': senderID}];
    }
}

exports.getPOSTPara = getPOSTPara
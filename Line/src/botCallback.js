var request = require('request');

function process_callback(event, data, msg){
    var reply;
    request.post(
        'http://150.95.147.150:3000/btc',
        { data: {'usersay': data, 'channel': 'line', 'callerid': '1234' }},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var obj = JSON.parse(body);
                console.log(obj['ans']);
                reply = obj['ans'];
                event.reply(reply);
            }
        }
        
    );   

 
    console.log(data);
}

exports.process_callback = process_callback
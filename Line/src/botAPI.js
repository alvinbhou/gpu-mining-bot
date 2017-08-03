var request = require('request');
function event_callback(event, postback_data){
    console.log(postback_data);
    var options = {
        method: 'POST',
        url: 'http://150.95.147.150:3000/coin',
        json: {'coin': 'xmr', 'usersay': 'hi;', 'channel': 'line', 'callerid': '1234' }
    };
    function callback(error, response, body) {
        // console.log(response.statusCode);;
        if (!error && response.statusCode == 200) {
           event.reply(body['ans']);
        }
    }   
    request(options, callback); 

 
    // console.log(data);
}

function callAPI(target, data, event){
    var options = {
        method: 'POST',
        url: 'http://150.95.147.150:3000/' + target,
        json: data
    };
    function callback(error, response, body) {
        // console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
          event.reply(body['ans']);
        }
    }   
    request(options, callback); 
    
}
exports.event_callback = event_callback
exports.callAPI = callAPI
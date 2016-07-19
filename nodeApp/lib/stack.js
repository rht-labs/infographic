var request = require('request');

var host = process.env['jenkinsUrl'] || 'http://localhost:8080';
var url = host + 'api';
function processStack(cb){
	console.log('Making call to '+ url);
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    //console.log(body) // Show the HTML for the Google homepage.
	    cb(null, body); 
	  }
	})

	
}



exports.processStack = processStack;
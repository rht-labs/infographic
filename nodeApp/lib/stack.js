var request = require('request');
var url = process.env['jenkinsUrl'] || 'http://localhost:8080';
function process(cb){
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    //console.log(body) // Show the HTML for the Google homepage.
	    cb(null, body); 
	  }
	})

	
}



exports.process = process;
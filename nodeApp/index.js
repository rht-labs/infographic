var express = require('express');
var app = express();
var stack = require('./lib/stack');

app.get('/stack', function (req, res) {
	console.log('in / route');
	stack.process(function(err, response){
		res.send(response);
	});	
	
  	
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
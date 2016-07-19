var express = require('express');
var app = express();
var stack = require('./lib/stack');
var bodyParser = require('body-parser');
app.use(bodyParser());
app.post('/stack', function (req, res) {
	console.log(req.body);
	console.log('in / route');
	stack.processStack(function(err, response){
		res.send(response);
	});	
	
  	
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
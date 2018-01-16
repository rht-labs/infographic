
const http = require('http');
const https = require('https');
const fs = require('fs');

const httpPort = process.env.INFOGRAPHIC_HTTP_PORT || 8080;

const httpsPort = process.env.INFOGRAPHIC_HTTPS_PORT || 8443;
const httpsKey = process.env.INFOGRAPHIC_HTTPS_KEY || '';
const httpsCert = process.env.INFOGRAPHIC_HTTPS_CERTIFICATE || '';

const websiteDir = process.env.INFOGRAPHIC_DIR || 'website';

var express = require('express');
var cors = require('cors');
var app = express();
var stack = require('./lib/stack');
var bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser());

app.use(express.static(websiteDir));

app.post('/stack', function (req, res) {
	stack.processStack(req.body,function(err, response){
		if (err){
			// TODO: make the return status code be more specific per the error
			// - i.e.: not use "400 Bad Request" for all of it
			res.status(400).send(err);
		} else {
			res.send(response);
		}
	});
});


if (httpsCert.trim() && httpsKey.trim()) {
	const options = {
		  key: fs.readFileSync(httpsKey),
		  cert: fs.readFileSync(httpsCert)
	};

	// Secure
	https.createServer(options, app).listen(httpsPort, function () {
		console.log('Listening on https://localhost:' + httpsPort);
	});
} else {
	// non-Secure
	http.createServer(app).listen(httpPort, function() {
		console.log('Listening on UNSECURE http://localhost:' + httpPort);
	});
}

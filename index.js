
const https = require('https');
const fs = require('fs');

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8443;
const httpTlsKey = process.env.INFOGRAPHIC_HTTP_TLS_KEY;
const httpTlsCert = process.env.INFOGRAPHIC_HTTP_TLS_CERTIFICATE;
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

const options = {
	  key: fs.readFileSync(httpTlsKey),
	  cert: fs.readFileSync(httpTlsCert)
};

https.createServer(options, app).listen(port);


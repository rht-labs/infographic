/*-
 * Infographic Infrastructure Automation Demo
 * %%
 * Copyright (C) 2016 - 2017 Red Hat Inc., Open Innovation Labs
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
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


/**
 * Handle the response from Ansible Tower stack processing request
 * @param err An error message, if present
 * @param response The response body
 */
var stackProcessingHandler = function(err, response) {
    if (err){
        // TODO: make the return status code be more specific per the error
        // - i.e.: not use "400 Bad Request" for all of it
        res.status(400).send(err);
    } else {
        res.send(response);
    }
};

/**
 * Handler for POST operations to `/stack` endpoint
 * @param req The Request object
 * @param res The Response object
 */
var processStack = function(req, res) {
	// Curry the response object into the callback function
    var callback = stackProcessingHandler.apply(res);

    stack.processStack(req.body, callback);
};


app.post('/stack', processStack);


if (httpsCert.trim() && httpsKey.trim()) {
	const options = {
		  key: fs.readFileSync(httpsKey),
		  cert: fs.readFileSync(httpsCert)
	};

	// Secure
	https.createServer(options, app).listen(httpsPort, function () {
		console.log('Listening on secure (https) port: ' + httpsPort);
	});
} else {
	// non-Secure
	http.createServer(app).listen(httpPort, function() {
		console.log('Listening on UNSECURE (http) port: ' + httpPort);
	});
}


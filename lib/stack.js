
var request = require('request');
var urlModule = require('url');

const AnsibleTowerUrl = process.env['ANSIBLE_TOWER_URL'];
const AnsibleTowerTemplateId = process.env['ANSIBLE_TOWER_TEMPLATE_ID'];
const OpenShiftAPIUrl = process.env['OPENSHIFT_API_URL'];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


function getTemplateLaunchUri(){
	return '/api/v2/job_templates/' + AnsibleTowerTemplateId + '/launch/';
}


function getOpenShiftAuthUri() {
	return '/oauth/authorize?response_type=token&client_id=openshift-challenging-client';
}


function getRequestUrl(server, uri){
	return 'https://' + server + uri;
}

function getAuth(params){
	return 'Basic ' + new Buffer(params['demo_username'] + ':' + params['demo_password']).toString('base64');
}


function generateReturnJson(message, url) {
	var returnjson = {
		message: message,
		url: ''
	};

	if (url) {
		returnjson['url'] = url;
	}

	return returnjson;
}


function sendResponse(cb, successMessage, errorMessage, url) {
	if (errorMessage) {
		console.log('ERROR: ' + errorMessage);
		returnjson = generateReturnJson(errorMessage, url);
		cb(returnjson, null);
	} else if (successMessage) {
		console.log('SUCCESS: ' + successMessage);
		returnjson = generateReturnJson(successMessage, url);
		cb(null, returnjson);
	} else {
		returnjson = generateReturnJson('Unknown Error');
		cb(returnjson, null);
	}
}

function sanitizeName(dirtyName){
	if(dirtyName){
		return dirtyName.replace(/\s+/g, '-').toLowerCase();
	}
	return false;
}


function sendTowerRequest(params, cb){
	var uri = getTemplateLaunchUri();
	var request_url = getRequestUrl(AnsibleTowerUrl, uri);
	var auth = getAuth(params);

	// Password no longer needed - delete it...
	delete params['demo_password'];

	var config_body = {
		"extra_vars" : {}
	};
	config_body['extra_vars'] = params;

	var options = {
		url: request_url,
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Authorization': auth
		},
		json: config_body
	};

	// options_string = JSON.stringify(options, null, 4);
	// console.log('calling options: ' + options_string);

	request(options, function (error, response) {
		console.log('*********RESPONSE**********************');
		console.log(response);
		console.log('**********END RESPONSE*****************');
		if (!error && response.statusCode >= 200 && response.statusCode < 300) {
			sendResponse(cb,
				     'Successful Launch with Ansible Tower job ID: ' + response.body.job,
				     null,
			             'https://' + AnsibleTowerUrl + '/#/jobs/' + response.body.job);

		} else {
			var errorMsg = 'Failed to launch Ansible Tower job. Please check your input and try again.';
			if (error) {
				errorMsg += '(' + error + ')';
	 		}

			sendResponse(cb, null, errorMsg, null);
	  	}
	})
}


function launchRequest(params, cb){
	var uri = getOpenShiftAuthUri();
	var request_url = getRequestUrl(OpenShiftAPIUrl, uri);
	var auth = getAuth(params);

	var options = {
		url: request_url,
		headers: {
			'Authorization': auth
		},
	};

	request(options, function (error, response) {
		if (!error && response.statusCode >= 200 && response.statusCode < 300) {
			var token = response.request.uri.hash.match(/access_token=([^&]+).*/)
			params['demo_token'] = token[1];
			// debug OCP token
			console.log("Demo token" + demo_token)
			console.log("Token" + token)
			sendTowerRequest(params, cb);
		} else {
			var errorMsg = 'Failed to obtain OpenShift token. Please check your credentials and try again.';
			if (error) {
				errorMsg += '(' + error + ')';
	 		}

			sendResponse(cb, null, errorMsg, null);
	  	}
	});
}


function processStack(body, cb){

	if (body && body.projectName && body.getUrl) {
		var params = urlModule.parse(body.getUrl, true).query;
		params['demo_projectname'] = sanitizeName(body.projectName);
		params['demo_scm_url'] = body.gitRepo;
		params['demo_username'] = body.username;
		params['demo_password'] = body.buildPassword;

		if (('node' in params) &&
		    (params['node'] == "true")) {
			launchRequest(params, cb);
		} else {
			sendResponse(cb, null, 'No Valid Technologies selected. Please check your selections and try again.', null);
		}
	} else {
		sendResponse(cb, null, 'No extra_vars specified.', null);
	}

}

exports.processStack = processStack;

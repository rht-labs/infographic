
var request = require('request');
var urlModule = require('url');

const ANSIBLE_TOWER_URL = process.env['ANSIBLE_TOWER_URL'];
const ANSIBLE_TOWER_TEMPLATE_ID = process.env['ANSIBLE_TOWER_TEMPLATE_ID'];
const OPENSHIFT_API_URL = process.env['OPENSHIFT_API_URL'];
const OPENSHIFT_AUTH_URI = '/oauth/authorize?response_type=token&client_id=openshift-challenging-client';
const TEMPLATE_LAUNCH_URI = '/api/v1/job_templates/' + ANSIBLE_TOWER_TEMPLATE_ID + '/launch/';

// Allow unverified TLS/SSL certificates when making web requests
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


function getRequestUrl(server, uri){
	return 'https://' + server + uri;
}

function getAuth(params){
	return 'Basic ' + new Buffer(params['demo_username'] + ':' + params['demo_password']).toString('base64');
}


function generateReturnJson(message, url) {
	var returnJSON = {
		message: message,
		url: ''
	};

	if (url) {
		returnJSON['url'] = url;
	}

	return returnJSON;
}


function sendResponse(callback, successMessage, errorMessage, url) {
	var returnJSON = {};
	if (errorMessage) {
		console.log('ERROR: ' + errorMessage);
		returnJSON = generateReturnJson(errorMessage, url);
		callback(returnJSON, null);
	} else if (successMessage) {
		console.log('SUCCESS: ' + successMessage);
		returnJSON = generateReturnJson(successMessage, url);
		callback(null, returnJSON);
	} else {
		returnJSON = generateReturnJson('Unknown Error');
		callback(returnJSON, null);
	}
}

function sanitizeName(dirtyName){
	if(dirtyName){
		return dirtyName.replace(/\s+/g, '-').toLowerCase();
	}
	return false;
}


function handleTowerResponse(callback, error, response) {
    // console.log('*********RESPONSE**********************');
    // console.log(response);
    // console.log('**********END RESPONSE*****************');
    if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        sendResponse(callback,
            'Successful Launch with Ansible Tower job ID: ' + response.body['job'],
            null,
            'https://' + ANSIBLE_TOWER_URL + '/#/jobs/' + response.body['job']);

    } else {
        var errorMsg = 'Failed to launch Ansible Tower job. Please check your input and try again.';
        if (error) {
            errorMsg += '(' + error + ')';
        }

        sendResponse(callback, null, errorMsg, null);
    }
}


function sendTowerRequest(params, callback) {
	// console.log('*********RESPONSE**********************');
	// console.log(response);
	// console.log('**********END RESPONSE*****************');
	if (!error && response.statusCode >= 200 && response.statusCode < 300) {
		sendResponse(callback,
				 'Successful Launch with Ansible Tower job ID: ' + response.body['job'],
				 null,
					 'https://' + ANSIBLE_TOWER_URL + '/#/jobs/' + response.body['job']);

	} else {
		var errorMsg = 'Failed to launch Ansible Tower job. Please check your input and try again.';
		if (error) {
			errorMsg += '(' + error + ')';
		}

		sendResponse(callback, null, errorMsg, null);
	}
	var request_url = getRequestUrl(ANSIBLE_TOWER_URL, TEMPLATE_LAUNCH_URI);
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

	var responseHandler = handleTowerResponse.apply(callback);

	request(options, responseHandler);
}

/**
 * Handle the response from OpenShift when requesting an OAuth token
 * @param callback Function to be called on successful completion of Ansible Tower job submission
 * @param error An error if one was encountered requesting the token
 * @param response The response, containing the token, if the request was successful
 */
function handleOpenShiftTokenResponse(callback, error, response) {
    if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        var token = response.request.uri.hash.match(/access_token=([^&]+).*/);
        params['demo_token'] = token[1];
        sendTowerRequest(params, callback);
    } else {
        var errorMsg = 'Failed to obtain OpenShift token. Please check your credentials and try again.';
        if (error) {
            errorMsg += '(' + error + ')';
        }

        sendResponse(callback, null, errorMsg, null);
    }
}


function launchRequest(params, callback){
	var request_url = getRequestUrl(OPENSHIFT_API_URL, OPENSHIFT_AUTH_URI);
	var auth = getAuth(params);

	var options = {
		url: request_url,
		headers: {
			'Authorization': auth
		}
	};

	// Pre-populate (Curry) the callback parameter so that the function signature matches what is expected
	// for Express.
	var responseHandler = handleOpenShiftTokenResponse.apply(callback);

	request(options, responseHandler);
}


function processStack(body, callback){

	if (body && body.projectName && body.getUrl) {
		var params = urlModule.parse(body.getUrl, true).query;
		params['demo_projectname'] = sanitizeName(body.projectName);
		params['demo_scm_url'] = body.gitRepo;
		params['demo_username'] = body.username;
		params['demo_password'] = body.buildPassword;

		if (('node' in params) && 
		    (params['node'] === "true")) {
			launchRequest(params, callback);
		} else {
			sendResponse(callback, null, 'No Valid Technologies selected. Please check your selections and try again.', null);
		}
	} else {
		sendResponse(callback, null, 'No extra_vars specified.', null);
	}

}

exports.processStack = processStack;


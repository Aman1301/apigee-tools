var request = require('sync-request');
var syncPrompt = require('readline-sync');
var express = require('express');
var app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// KVM Functions
exports.displayKVMEntry = function (entry) {
	console.log("");
	console.log("--------  Below are the key and values seperated by : --------")
	console.log("");
	for (var i = 0; i < entry.length; i++) {
		console.log(entry[i].name + " : " + entry[i].value);
	}
	console.log("--------  List of Key : Values Ends ---------------------------");
	console.log(" Total Number of Entries : " + entry.length);
	console.log("*******************************************");
}

exports.createKVM = function (HOST, pathPrefix, orgName, environment, username, password, kvmName) {
	//var keyValues = syncPrompt.prompt();
	var entry = [];
	var keyValuePayload = '{"name" : "' + kvmName + '", "entry" : ' + JSON.stringify(entry) + '}';
	var options = {
		'headers' : {
			'content-type' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		},
		'body' : keyValuePayload
	}
	var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/keyvaluemaps/';
	var res = request('POST', url, options);
	//console.log(new Buffer(res.body).toString());
	kvmValues = JSON.parse(new Buffer(res.body).toString());
	entry = kvmValues.entry;
	console.log("");
	console.log('Create successful!');
	console.log("");
	return entry;
}

exports.deleteKVM = function (HOST, pathPrefix, orgName, environment, username, password, kvmName) {
	// Prompt Start Update the key
	var answer = syncPrompt.question('Are you sure you want to delete the KVM : ' + kvmName + ' (y/n) ? ');
	console.log("Your Answer is :" + answer);
	if (answer == 'y') {
		var entry = [];
		var keyValuePayload = '{"name" : "' + kvmName + '", "entry" : ' + JSON.stringify(entry) + '}';
		var options = {
			'headers' : {
				'content-type' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
			}
		}
		var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/keyvaluemaps/' + kvmName;
		var res = request('DELETE', url, options);
		//console.log(new Buffer(res.body).toString());

		if (res.statusCode == 200) {
			console.log("");
			console.log('KVM  is deleted successfully! ');
			console.log('-----------------------------------------------------');
			console.log("");
			return kvmName;
		} else {
			console.log("");
			console.log("Error In Delete, Below is response from server: ");
			console.log(new Buffer(res.body).toString());
			console.log('-----------------------------------------------------');
			console.log("");
		}
		// Prompt Update the key value Ends
	} else {
		console.log("");
		console.log('Delete Aborted! ');
		console.log('-----------------------------------------------------');
		console.log("");
		return null;
	}
}

exports.searchKVMEntry = function (entry, keyName) {
	keyNameLower = keyName.toLowerCase();
	var matchingEntries = new Array();
	for (var i = 0; i < entry.length; i++) {
		entryNameLower = entry[i].name.toLowerCase();
		if (entryNameLower.indexOf(keyNameLower) >= 0) {
			var matchingEntry = {
				"name" : entry[i].name,
				"value" : entry[i].value
			}
			matchingEntries.push(matchingEntry);
		}
	}
	if (matchingEntries.length == 0) {
		console.log("No Matching Entries Found");
	} else {
		console.log("--------  Below are the Matching Entries For Key : " + keyName);
		console.log("");
		for (var i = 0; i < matchingEntries.length; i++) {
			console.log(matchingEntries[i].name + " : " + matchingEntries[i].value);
			console.log("");
			console.log("********************");
		}
		console.log("--------  key and values seperated by : --------  Ends");
	}
}

exports.listKVMEntries = function (HOST, pathPrefix, orgName, environment, username, password, kvmName) {
	var options = {
		'headers' : {
			'Accept' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		}
	}
	var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/keyvaluemaps/' + kvmName;
	var res = request('GET', url, options);
	if (res.statusCode != 200) {
		console.error('Error In Getting Entries for Key Value Map ' + kvmName + ". Server responded with below error: ");
		console.log(new Buffer(res.body).toString());
		process.exit(1);
	}
	console.log("Key Value Entries for " + kvmName + " are below: ----------------------------------");
	kvmValues = JSON.parse(new Buffer(res.body).toString());
	entry = kvmValues.entry;
	return entry;
}

exports.updateKVMEntries = function (HOST, pathPrefix, orgName, environment, username, password, kvmName) {
	// Prompt Start Update the key
	console.log("Please enter the key and value separated by : and seperate multiple keyValues by '#'");
	console.log("Example:- key1=value1#key2=value2");
	var keyValues = syncPrompt.prompt();
	var entry = [];
	var flag = true;
	var keyVlauesArray = keyValues.split("#");
	for (var i = 0; i < keyVlauesArray.length; i++) {
		var keyValueJsonObj = {
			"name" : null,
			"value" : null
		};
		if (keyVlauesArray[i].indexOf("=") >= 1) {
			keyValueJsonObj.name = keyVlauesArray[i].split("=")[0];
			keyValueJsonObj.value = keyVlauesArray[i].split("=")[1];
			entry.push(keyValueJsonObj);
		} else {
			console.log("Please give key value = seperated");
			flag = false;
			break;
		}
	}

	if (flag) {
		var keyValuePayload = '{"name" : "' + kvmName + '", "entry" : ' + JSON.stringify(entry) + '}';
		var options = {
			'headers' : {
				'content-type' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
			},
			'body' : keyValuePayload
		}
		var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/keyvaluemaps/' + kvmName;
		var res = request('PUT', url, options);
		console.log(new Buffer(res.body).toString());
		kvmValues = JSON.parse(new Buffer(res.body).toString());
		entry = kvmValues.entry;
		console.log("");
		console.log('Update successful! Updated Entries are Below: ');
		console.log("");
		return entry;
	}
}

exports.deleteKVMEntry = function (HOST, pathPrefix, orgName, environment, username, password, kvmName) {
	// Prompt Start Update the key
	console.log("--------Enter the key name to delete ")
	var keyName = syncPrompt.prompt();
	var answer = syncPrompt.question('Are you sure you want to delete : ' + keyName + ' (y/n) ? ');
	console.log("Your Answer is :" + answer);
	if (answer == 'y') {
		var entry = [];
		var keyValuePayload = '{"name" : "' + kvmName + '", "entry" : ' + JSON.stringify(entry) + '}';
		var options = {
			'headers' : {
				'content-type' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
			}
		}
		var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/keyvaluemaps/' + kvmName + '/entries/' + keyName;
		var res = request('DELETE', url, options);
		//console.log(new Buffer(res.body).toString());
		if (res.statusCode == 200) {
			kvmValues = JSON.parse(new Buffer(res.body).toString());
			entry = kvmValues.entry;
			console.log("");
			console.log('Delete successful! ');
			console.log('-----------------------------------------------------');
			console.log("");
			return keyName;
		} else {
			console.log("");
			console.log("Error In Delete, Below is response from server: ");
			console.log(new Buffer(res.body).toString());
			console.log('-----------------------------------------------------');
			console.log("");
		}
		// Prompt Update the key value Ends
	} else {
		console.log("");
		console.log('Delete Aborted! ');
		console.log('-----------------------------------------------------');
		console.log("");
		return null;
	}
}
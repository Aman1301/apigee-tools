var request = require('sync-request');

var config = require('./config');
var helper = require('./helper');
var helperKVM = require('./helperKVM');
var helperTS = require('./helperTargetServer');
var helperCache = require('./helperCache');
var helperAnalytics = require('./helperAnalytics');

// Create Server
var syncPrompt = require('readline-sync');
var express = require('express');
var app = express();
app.listen(3001);

var entry = "";
var kvmName = "";

helper.showMainOptions();
var mainOption = syncPrompt.prompt();

if (mainOption == "1") {
	console.log("Please provide Environment (Example: dev/stage/prod ): ");
	var environmentName = syncPrompt.prompt();

	console.log("Please Provide Org Admin Username: ");
	var username = syncPrompt.prompt();

	console.log("Please Provide Org Admin Password: ");
	var password = syncPrompt.prompt({
			noEchoBack : true
		});

	baaSParams = config.baaSParams(environmentName);
	// console.log("baaSParams : " + JSON.stringify(baaSParams));

	environment = baaSParams.environment;
	var options = {
		'headers' : {
			'Accept' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		}
	}

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	var url = baaSParams.HOST + baaSParams.pathPrefix + baaSParams.orgName + '/environments/' + environment + '/keyvaluemaps';
	// console.log("KVM URL : " + JSON.stringify(url));

	var res = request('GET', url, options);
	if (res.statusCode != 200) {
		console.error('Error In Getting KVM List');
		console.log(new Buffer(res.body).toString());
		process.exit(1);
	}

	responsePayload = new Buffer(res.body).toString();
	kvmList = JSON.parse(responsePayload);
	displayKVMList(kvmList);
	while (1) {
		helper.showKVMOptions();
		var optionEntered = helper.inputMainOptions();
		console.log("Option Provided: " + optionEntered);

		if (optionEntered == 1) {
			console.log("Please type the key you want to search: ");
			var keyName = syncPrompt.prompt();
			entry = helperKVM.listKVMEntries(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, kvmName);
			helperKVM.searchKVMEntry(entry, keyName);
		} else if (optionEntered == 2) {
			var updatedEntry = helperKVM.updateKVMEntries(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, kvmName);
			if (updatedEntry) {
				helperKVM.displayKVMEntry(updatedEntry);
			}
		} else if (optionEntered == 3) {
			var deletedEntry = helperKVM.deleteKVMEntry(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, kvmName);
			if (deletedEntry) {
				entry = helperKVM.listKVMEntries(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, kvmName);
				helperKVM.displayKVMEntry(entry);
			}
		} else if (optionEntered == 4) {
			var deletedKVM = helperKVM.deleteKVM(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, kvmName);
			if (deletedKVM) {
				displayKVMList(kvmList);
			}
		} else if (optionEntered == 5) {
			displayKVMList(kvmList);
		} else {
			console.log("Please Provide valid Option");
		}
	}
} else if (mainOption == "2") {
	console.log("Please provide Environment (Example: dev/stage/prod ): ");
	var environmentName = syncPrompt.prompt();

	console.log("Please Provide Org Admin Username: ");
	var username = syncPrompt.prompt();

	console.log("Please Provide Org Admin Password: ");
	var password = syncPrompt.prompt({
			noEchoBack : true
		});

	baaSParams = config.baaSParams(environmentName);
	environment = baaSParams.environment;
	var options = {
		'headers' : {
			'Accept' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		}
	}
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	var url = baaSParams.HOST + baaSParams.pathPrefix + baaSParams.orgName + '/environments/' + environment + '/targetservers';
	// console.log("Target Server URL : " + JSON.stringify(url));

	var res = request('GET', url, options);
	if (res.statusCode != 200) {
		console.error('Error In Getting Target Server List');
		console.log(new Buffer(res.body).toString());
		process.exit(1);
	}

	responsePayload = new Buffer(res.body).toString();
	targetServerList = JSON.parse(responsePayload);

	console.log("-------- Below are name of Target Servers in this environment: --------");
	console.log("");
	for (var i = 0; i < targetServerList.length; i++) {
		var options1 = {
			'headers' : {
				'content-type' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
			}
		}
		var url1 = baaSParams.HOST + baaSParams.pathPrefix + baaSParams.orgName + '/environments/' + environment + '/targetservers/' + targetServerList[i];
		var getResponse = request('GET', url1, options1);
		var getResponsePayload = new Buffer(getResponse.body).toString();
		getResponseJson = JSON.parse(getResponsePayload);
		console.log("Target Server Name :  " + targetServerList[i] + " , Host : " + getResponseJson.host);
	}
	console.log("");
	console.log("------------------------------------------------------------");
	console.log("");
	console.log("Enter a Target Server Name From Above List: ");
	
	var targetServerName = syncPrompt.prompt();
	if (targetServerName == "exit") {
		process.exit(1);
	} else {
		var targetServerDetails = helperTS.listTargetServerEntries(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, targetServerName);
		helperTS.displayTargetServerDetails(targetServerDetails);

		while (1) {
			helper.showTargetServerOptions();
			var optionEntered = helper.inputMainOptions();
			console.log("Option Provided: " + optionEntered);
			if (optionEntered == 1) {
				console.log("Please type the target server you want to search: ");
				targetServerName = syncPrompt.prompt();
				targetServerDetails = helperTS.listTargetServerEntries(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, targetServerName);
				helperTS.displayTargetServerDetails(targetServerDetails);
			} else if (optionEntered == 2) {
				var createdEntry = helperTS.createTargetServer(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password);
				if (createdEntry) {
					helperTS.displayTargetServerDetails(createdEntry);
				}
			} else if (optionEntered == 3) {
				var updatedEntry = helperTS.updateTargetServer(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password);
				if (updatedEntry) {
					helperTS.displayTargetServerDetails(updatedEntry);
				}
			} else if (optionEntered == 4) {
				var deletedEntry = helperTS.deleteTargetServer(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password);
				if (deletedEntry) {
					helperTS.listAllTargetServers(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password);
				}
			} else {
				console.log("Please Provide valid Option");
			}
		}
	}
} else if (mainOption == "3") {

} else if (mainOption == "4") {

} else {
	process.exit(1);
}

// Utility Functions
function displayKVMList(kvmList) {
	console.log("-------- Below are name of Key Value Maps in this environment: --------");
	console.log("");
	for (var i = 0; i < kvmList.length; i++) {
		console.log(" KVM Name :  " + kvmList[i]);
	}
	console.log("");
	console.log("----------------------------------------------------------------");
	console.log("");
	console.log("Enter a KVM Name From Above list OR To create a new KVM type new");
	console.log("");

	kvmName = syncPrompt.prompt();
	if (kvmName == "new") {
		console.log("");
		console.log("Enter the name of new KVM");
		kvmName = syncPrompt.prompt();
		var createEntry = helperKVM.createKVM(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, kvmName);
	}

	entry = helperKVM.listKVMEntries(baaSParams.HOST, baaSParams.pathPrefix, baaSParams.orgName, environment, username, password, kvmName);
	helperKVM.displayKVMEntry(entry);
}
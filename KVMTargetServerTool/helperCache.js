var request = require('sync-request');
var syncPrompt = require('readline-sync');
var express = require('express');
var app = express();

var config = require('./config');
var helper = require('./helper');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Cache Functions

exports.listCacheEntries = function (HOST, pathPrefix, orgName, environment, username, password, cacheName) {
	var options = {
		'headers' : {
			'Accept' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		}
	}
	var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/caches/' + cacheName;
	console.log(url);
	var res = request('GET', url, options);
	if (res.statusCode != 200) {
		console.error('Error In Getting Entries for Cache ' + cacheName + ". Server responded with below error: ");
		console.log(new Buffer(res.body).toString());
		process.exit(1);
	}
	console.log("Details for " + cacheName + " are below: ----------------------------------");
	cacheResponse = JSON.parse(new Buffer(res.body).toString());
	console.log(new Buffer(res.body).toString());
	return cacheResponse;
}



exports.displayCacheDetails = function (cacheDetails) {

	var name = cacheDetails.name;
	var description = cacheDetails.description;
	var diskSizeInMB = cacheDetails.diskSizeInMB;
	var distributed = cacheDetails.distributed;
	var expirySettings = cacheDetails.expirySettings;
	var inMemorySizeInKB = cacheDetails.inMemorySizeInKB;
	var maxElementsInMemory = cacheDetails.maxElementsInMemory;
	var maxElementsOnDisk = cacheDetails.maxElementsOnDisk;

	var overflowToDisk = cacheDetails.overflowToDisk;
	var persistent = cacheDetails.persistent;
	//var valuesNull=expirySettings.valuesNull;
	var timeOutInSecExpirySettings=expirySettings.timeoutInSec.value;


	console.log("--------  Below are Cache Information seperated by : --------");
	console.log("");
	console.log("Name : " + name);
	console.log("Description : " + description);
	console.log("DiskSizeInMB : " + diskSizeInMB);
	console.log("Distributed : " + distributed);
	console.log("Expiry Settings TimeOutInSec : "+ timeOutInSecExpirySettings);

	console.log("InMemorySizeInKB : " + inMemorySizeInKB);
	console.log("MaxElementsInMemory : " + maxElementsInMemory);
	console.log("MaxElementsOnDisk : " + maxElementsOnDisk);
	console.log("OverflowToDisk : " + overflowToDisk);
	console.log("Persistent : " + persistent);
	
	console.log("*******************************************");
}

exports.createCache = function (HOST, pathPrefix, orgName, environment, username, password) {
	console.log("Enter Cache Name : ");
	var cacheName = syncPrompt.prompt();
	console.log("Please provide Cache Description :");
	var cacheDescription = syncPrompt.prompt();
	console.log("Please provide Cache timeOutInSecExpirySettings");
	var cacheTimeOutInSecExpirySettings = syncPrompt.prompt();
	console.log("Please provide Cache Disk Size in MB:");
	var cacheDiskSizeInMB = syncPrompt.prompt();
	console.log("Please provide Cache inMemorySizeInKB");
	var cacheInMemorySizeInKB = syncPrompt.prompt();
	console.log("Please provide Cache maxElementsInMemory");
	var cacheMaxElementsInMemory = syncPrompt.prompt();
	console.log("Please provide Cache maxElementsOnDisk");
	var cacheMaxElementsOnDisk = syncPrompt.prompt();
	console.log("Please provide Cache OverFlowToDisk");
	var cacheOverflowToDisk = syncPrompt.prompt();	
	console.log("Is Cache Persistent");
	var cachePersistent = syncPrompt.prompt();
	console.log("Please provide Cache skipCacheIfElementSizeInKBExceeds");
	var cacheSkipCacheIfElementSizeInKBExceeds = syncPrompt.prompt();
	

	var cacheCreatePayload = '{"name" : "' + cacheName + '", "description" : "' + cacheDescription + '", "diskSizeInMB" : ' + cacheDiskSizeInMB;
	cacheCreatePayload += ', "expirySettings" : { "timeoutInSec" : {"value":'+cacheTimeOutInSecExpirySettings+'}}';
	cacheCreatePayload += ', "inMemorySizeInKB" : ' + cacheInMemorySizeInKB ;
	cacheCreatePayload += ', "maxElementsInMemory" : ' + cacheMaxElementsInMemory ;
	cacheCreatePayload += ', "maxElementsOnDisk" : ' + cacheMaxElementsOnDisk ;
	cacheCreatePayload += ', "overflowToDisk" : ' + cacheOverflowToDisk ;
	cacheCreatePayload += ', "skipCacheIfElementSizeInKBExceeds" : ' + cacheSkipCacheIfElementSizeInKBExceeds ;
	cacheCreatePayload += ', "persistent" : ' + cachePersistent +'}';

	console.log(cacheCreatePayload);
	console.log("Add Request Payload : " + cacheCreatePayload);
	var options = {
		'headers' : {
			'content-type' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		},
		'body' : cacheCreatePayload
	}
	var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/caches/';
	var res = request('POST', url, options);
	//console.log(new Buffer(res.body).toString());
	var cacheResponse = JSON.parse(new Buffer(res.body).toString());
	console.log("");
	console.log('Create successful! Entries are Below: ');
	console.log("");
	return cacheResponse;
}

exports.updateCache = function (HOST, pathPrefix, orgName, environment, username, password) {
	console.log("Enter a Cache Name to Update : ");
	var cacheName = syncPrompt.prompt();
	var options = {
		'headers' : {
			'Accept' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		}
	}
	var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/caches/' + cacheName;
	var res = request('GET', url, options);
	if (res.statusCode != 200) {
		console.error('Error In Getting Entries for Target Server ' + cacheName + ". Server responded with below error: ");
		console.log(new Buffer(res.body).toString());
		process.exit(1);
	}
	var cacheDetails = JSON.parse(new Buffer(res.body).toString());
	var name = cacheDetails.name;
	var description = cacheDetails.description;
	var diskSizeInMB = cacheDetails.diskSizeInMB;
	var distributed = cacheDetails.distributed;
	var expirySettings = cacheDetails.expirySettings;
	var inMemorySizeInKB = cacheDetails.inMemorySizeInKB;
	var maxElementsInMemory = cacheDetails.maxElementsInMemory;
	var maxElementsOnDisk = cacheDetails.maxElementsOnDisk;

	var overflowToDisk = cacheDetails.overflowToDisk;
	var persistent = cacheDetails.persistent;
	//var valuesNull=expirySettings.valuesNull;
	var timeOutInSecExpirySettings=expirySettings.timeoutInSec.value;

	console.log("Please provide Cache Description : ( leave blank if unchanged) ");
	var cacheDescription = syncPrompt.prompt();
	if (cacheDescription == "") {
		cacheDescription = description;
	}
	console.log("Please provide Cache timeOutInSecExpirySettings");
	var cacheTimeOutInSecExpirySettings = syncPrompt.prompt();
	if (cacheTimeOutInSecExpirySettings == "") {
		cacheTimeOutInSecExpirySettings = timeOutInSecExpirySettings;
	}
	console.log("Please provide Cache Disk Size in MB:");
	var cacheDiskSizeInMB = syncPrompt.prompt();
	if (cacheDiskSizeInMB == "") {
		cacheDiskSizeInMB = diskSizeInMB;
	}
	console.log("Please provide Cache inMemorySizeInKB");
	var cacheInMemorySizeInKB = syncPrompt.prompt();
	if (cacheInMemorySizeInKB == "") {
		cacheInMemorySizeInKB = inMemorySizeInKB;
	}
	console.log("Please provide Cache maxElementsInMemory");
	var cacheMaxElementsInMemory = syncPrompt.prompt();
	if (cacheMaxElementsInMemory == "") {
		cacheMaxElementsInMemory = maxElementsInMemory;
	}
	console.log("Please provide Cache maxElementsOnDisk");
	var cacheMaxElementsOnDisk = syncPrompt.prompt();
	if (cacheMaxElementsOnDisk == "") {
		cacheMaxElementsOnDisk = MaxElementsOnDisk;
	}
	console.log("Please provide Cache OverFlowToDisk");
	var cacheOverflowToDisk = syncPrompt.prompt();	
	if (cacheOverflowToDisk == "") {
		cacheOverflowToDisk = overflowToDisk;
	}
	console.log("Is Cache Persistent");
	var cachePersistent = syncPrompt.prompt();
	if (cachePersistent == "") {
		cachePersistent = persistent;
	}
	console.log("Please provide Cache skipCacheIfElementSizeInKBExceeds");
	var cacheSkipCacheIfElementSizeInKBExceeds = syncPrompt.prompt();
	if (cacheSkipCacheIfElementSizeInKBExceeds == "") {
		cacheSkipCacheIfElementSizeInKBExceeds = skipCacheIfElementSizeInKBExceeds;
	}

	var cacheUpdatePayload = '{"name" : "' + cacheName + '", "description" : "' + cacheDescription + '", "diskSizeInMB" : ' + cacheDiskSizeInMB;
	cacheUpdatePayload += ', "expirySettings" : { "timeoutInSec" : {"value":'+cacheTimeOutInSecExpirySettings+'}}';
	cacheUpdatePayload += ', "inMemorySizeInKB" : ' + cacheInMemorySizeInKB ;
	cacheUpdatePayload += ', "maxElementsInMemory" : ' + cacheMaxElementsInMemory ;
	cacheUpdatePayload += ', "maxElementsOnDisk" : ' + cacheMaxElementsOnDisk ;
	cacheUpdatePayload += ', "overflowToDisk" : ' + cacheOverflowToDisk ;
	cacheUpdatePayload += ', "skipCacheIfElementSizeInKBExceeds" : ' + cacheSkipCacheIfElementSizeInKBExceeds ;
	cacheUpdatePayload += ', "persistent" : ' + cachePersistent +'}';

	console.log("Update Request Payload : " + cacheUpdatePayload);
	var options = {
		'headers' : {
			'content-type' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		},
		'body' : cacheUpdatePayload
	}
	var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/caches/' + cacheName;
	var res = request('PUT', url, options);
	//console.log(new Buffer(res.body).toString());
	var cacheResponse = JSON.parse(new Buffer(res.body).toString());
	console.log("");
	console.log('Update successful! Updated Entries are Below: ');
	console.log("");
	return cacheResponse;
}

exports.deleteCache= function (HOST, pathPrefix, orgName, environment, username, password) {
	// Prompt Start Update the key
	console.log("--------enter the Cache Name to delete :")
	var cacheName = syncPrompt.prompt();
	var answer = syncPrompt.question('Are you sure you want to delete : ' + cacheName + ' (y/n) ? ');
	console.log("Your Answer is :" + answer);
	if (answer == 'y') {
		var options = {
			'headers' : {
				'content-type' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
			}
		}
		var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/caches/' + cacheName;
		var res = request('DELETE', url, options);
		//console.log(new Buffer(res.body).toString());
		if (res.statusCode == 200) {
			cacheResponse = JSON.parse(new Buffer(res.body).toString());
			console.log("");
			console.log('Delete successful! ');
			console.log('-----------------------------------------------------');
			console.log("");
			return cacheResponse;
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

exports.listAllCaches = function (HOST, pathPrefix, orgName, environment, username, password) {
	var options = {
		'headers' : {
			'Accept' : 'application/json',
			'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
		}
	}
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	var url = HOST + pathPrefix + orgName + '/environments/' + environment + '/caches';
	//console.log("URL : "+ url);
	var res = request('GET', url, options);
	//console.log(new Buffer(res.body).toString());
	if (res.statusCode != 200) {
		console.error('Error In Getting Caches List');
		console.log(new Buffer(res.body).toString());
		process.exit(1);
	}
	responsePayload = new Buffer(res.body).toString();
	cachesList = JSON.parse(responsePayload);
	console.log("-------- Below are name of Caches in this environment: --------");
	console.log("");
	for (var i = 0; i < cachesList.length; i++) {
		var options1 = {
			'headers' : {
				'content-type' : 'application/json',
				'Authorization' : 'Basic ' + new Buffer(username + ":" + password).toString('base64')
			}
		}
		var url1 = HOST + pathPrefix + orgName + '/environments/' + environment + '/caches/' + cachesList[i];
		var getResponse = request('GET', url1, options1);
		var getResponsePayload = new Buffer(getResponse.body).toString();
		getResponseJson = JSON.parse(getResponsePayload);
		console.log("Cache Name :  " + cachesList[i] + " , Host : " + getResponseJson.host);
	}
	console.log("");
	console.log("------------------------------------------------------------");
	console.log("");
}
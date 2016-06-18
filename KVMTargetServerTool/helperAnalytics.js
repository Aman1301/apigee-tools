var request = require('sync-request');
var syncPrompt = require('readline-sync');
var express = require('express');
var app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.fetchAnalytics = function (baaSParams, options, dimension, aggregate, variable, startTime, endTime) {
	var url = baaSParams.HOST + baaSParams.pathPrefix + baaSParams.orgName + '/environments/' + baaSParams.environment;
	url += '/stats/' + dimension;
	if (aggregate == "") {
		url += '?select=' + aggregate + '(' + variable + ')';
	} else {
		url += '?select=' + variable;
	}
	url += '&timeRange=' + startTime + '%2000:00~' + endTime + '%2000:00' + '&timeUnit=day';

	var res = request('GET', url, options);
	apiProxyStats = JSON.parse(new Buffer(res.body).toString());
	console.log(new Buffer(res.body).toString());
}

// API Proxy Analytics Functions
exports.displayAPIProxyList = function(apiList) {
	console.log("-------- Below are names of API Proxies in this environment: --------");
	console.log("");
	for (var i = 0; i < apiList.length; i++) {
		console.log(" API Proxy Name :  " + apiList[i]);
	}
	console.log("");
	console.log("----------------------------------------------------------------");
	console.log("");
}

// Apps Analytics Functions
exports.displayAppsList = function(appsList) {
	console.log("-------- Below are names of Applications in this environment: --------");
	console.log("");
	for (var i = 0; i < appsList.app.length; i++) {
		console.log(" Application Name (ID) :  " + appsList.app[i].name + " (" + appsList.app[i].appId + ")");
	}
	console.log("");
	console.log("----------------------------------------------------------------");
	console.log("");
}

// Developer Analytics Functions
exports.displayDeveloperList = function(devsList) {
	console.log("-------- Below are names of Developers in this environment: --------");
	console.log("");
	for (var i = 0; i < devsList.developer.length; i++) {
		console.log(" Developer Email (ID) :  " + devsList.developer[i].email + " (" + devsList.developer[i].developerId + ")");
	}
	console.log("");
	console.log("----------------------------------------------------------------");
	console.log("");
}
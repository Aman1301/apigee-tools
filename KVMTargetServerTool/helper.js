var request = require('sync-request');
var config = require('./config');
var helper = require('./helper');
//create server
var syncPrompt = require('readline-sync');
var express = require('express');
var util = require('util');
var async = require('async');

var app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
exports.display = function (entry){
					console.log("--------  Below are the key and values seperated by : --------")
					console.log("");
					for (var i = 0; i < entry.length; i++) {
						console.log(entry[i].name+ " : " +entry[i].value);
						console.log("");
						console.log("********************");
					}
					console.log("--------  List of Key : Values Ends ---------------------------");
					console.log(" Total Number of Entries : "+ entry.length);
					console.log("*******************************************");

}
exports.showMainOptions = function(){
					console.log(" Please Select Your Option From Below: ");
					console.log(" Press 1 for : Using KVM Operations .");
					console.log(" Press 2 for : Using Target Server Operations.");
					console.log(" Type exit for Closing This Application.");
}

exports.showOptions = function(){
					console.log(" Please Select Your Option From Below: ");
					console.log(" Press 1 for : Searching a Key /Value .");
					console.log(" Press 2 for : Add/Update Key /Value Entries.");
					console.log(" Press 3 for : Deleting a Key.");
					console.log(" Press 4 for : Deleting the KVM Name.");
					console.log(" Press 5 for : Switching to another KVM.");					
					console.log(" Type exit for Closing This Application.");
}

exports.listKVMENtries = function (HOST,pathPrefix,orgName,environment,username,password,kvmName){
	var options = {
    	'headers': {
			'Accept': 'application/json',
			'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
		}
	} 
	var url = HOST + pathPrefix + orgName+ '/environments/'+environment+'/keyvaluemaps/'+kvmName;
	var res = request('GET',url,options);
	if( res.statusCode != 200) {
		console.error('Error In Getting Entries for Key Value Map '+ kvmName+ ". Server responded with below error: ");
		console.log(new Buffer(res.body).toString());
		process.exit(1);	
	}
	console.log("Key Value Entries for "+kvmName+" are below: ----------------------------------");	
	kvmValues = JSON.parse(new Buffer(res.body).toString());
	entry  = kvmValues.entry;
	return entry;
	}

exports.inputKVMOptions = function (){
menu = 0;	  

menu = syncPrompt.prompt();

if ((menu == 'exit')){

    process.exit(1);
  }else {
  return menu;
  }
}
exports.createKVM = function(HOST,pathPrefix,orgName,environment,username,password,kvmName){

//var keyValues = syncPrompt.prompt();
var entry = [];

	var  keyValuePayload = '{"name" : "'+kvmName+'", "entry" : '+JSON.stringify(entry)+'}';
	var options = {
					'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								},
					'body' : keyValuePayload
				}
	var url = HOST + pathPrefix +orgName+ '/environments/'+environment+'/keyvaluemaps/';
	var res = request('POST',url,options);		
	//console.log(new Buffer(res.body).toString());		
	kvmValues = JSON.parse(new Buffer(res.body).toString());
	entry  = kvmValues.entry;
	console.log("");
	console.log('Create successful!'); 
	console.log("");
	return entry;

}

exports.updateKVM = function(HOST,pathPrefix,orgName,environment,username,password,kvmName){
// Prompt Start Update the key 
console.log("Please enter the key and value separated by : and seperate multiple keyValues by '#'");
console.log("Example:- key1=value1#key2=value2");
var keyValues = syncPrompt.prompt();
var entry = [];
var flag = true;
var keyVlauesArray = keyValues.split("#");
for (var i = 0; i < keyVlauesArray.length; i++) {
	var keyValueJsonObj = {
							"name": null,
							"value": null
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
if(flag){
	var  keyValuePayload = '{"name" : "'+kvmName+'", "entry" : '+JSON.stringify(entry)+'}';
	var options = {
					'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								},
					'body' : keyValuePayload
				}
	var url = HOST + pathPrefix +orgName+ '/environments/'+environment+'/keyvaluemaps/'+kvmName;
	var res = request('PUT',url,options);		
	console.log(new Buffer(res.body).toString());		
	kvmValues = JSON.parse(new Buffer(res.body).toString());
	entry  = kvmValues.entry;
	console.log("");
	console.log('Update successful! Updated Entries are Below: '); 
	console.log("");
	return entry;
}
}

exports.deleteKVM = function(HOST,pathPrefix,orgName,environment,username,password,kvmName){
// Prompt Start Update the key 

var answer = syncPrompt.question('Are you sure you want to delete the KVM : '+kvmName+' (y/n) ? ');
console.log("Your Answer is :"+answer);
if( answer == 'y') {
var entry = [];
	var  keyValuePayload = '{"name" : "'+kvmName+'", "entry" : '+JSON.stringify(entry)+'}';
	var options = {
					'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								}
				}
	var url = HOST + pathPrefix +orgName+ '/environments/'+environment+'/keyvaluemaps/'+kvmName;
	var res = request('DELETE',url,options);
	//console.log(new Buffer(res.body).toString());	
	if( res.statusCode == 200) {
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


exports.deleteKVMEntry = function(HOST,pathPrefix,orgName,environment,username,password,kvmName){
// Prompt Start Update the key 
console.log("--------enter the key name to delete ")
var keyName = syncPrompt.prompt();
var answer = syncPrompt.question('Are you sure you want to delete : '+keyName+' (y/n) ? ');
console.log("Your Answer is :"+answer);
if( answer == 'y') {
var entry = [];
	var  keyValuePayload = '{"name" : "'+kvmName+'", "entry" : '+JSON.stringify(entry)+'}';
	var options = {
					'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								}
				}
	var url = HOST + pathPrefix +orgName+ '/environments/'+environment+'/keyvaluemaps/'+kvmName+'/entries/'+keyName;
	var res = request('DELETE',url,options);
	//console.log(new Buffer(res.body).toString());	
	if( res.statusCode == 200) {
		kvmValues = JSON.parse(new Buffer(res.body).toString());
		entry  = kvmValues.entry;
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

exports.searchEntry= function (entry,keyName){
					keyNameLower = keyName.toLowerCase();
	                var matchingEntries = new Array();
	                for (var i = 0; i < entry.length; i++) {
	                	entryNameLower = entry[i].name.toLowerCase();
	                	if ( entryNameLower.indexOf(keyNameLower) >= 0) {
	                		var matchingEntry = {
    											"name": entry[i].name,
    											"value": entry[i].value 
							}
							matchingEntries.push(matchingEntry);
	                	}
					}
					if(matchingEntries.length == 0) {
						console.log("No Matching Entries Found");
					}
					else {
						console.log("--------  Below are the Matching Entries For Key : "+keyName);
						console.log("");
						for (var i = 0; i < matchingEntries.length; i++) {
							console.log(matchingEntries[i].name+ " : " +matchingEntries[i].value);
							console.log("");
							console.log("********************");
						}	
						console.log("--------  key and values seperated by : --------  Ends");
					}
}

exports.listTargetServerEntries = function (HOST,pathPrefix,orgName,environment,username,password,targetServerName){
	var options = {
    	'headers': {
			'Accept': 'application/json',
			'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
		}
	} 
	var url = HOST + pathPrefix + orgName+ '/environments/'+environment+'/targetservers/'+targetServerName;
	var res = request('GET',url,options);
	if( res.statusCode != 200) {
		console.error('Error In Getting Entries for Target Server '+ targetServerName+ ". Server responded with below error: ");
		console.log(new Buffer(res.body).toString());
		process.exit(1);	
	}
	console.log("Details for "+targetServerName+" are below: ----------------------------------");	
	targetServerResponse = JSON.parse(new Buffer(res.body).toString());
	console.log(new Buffer(res.body).toString());
	return targetServerResponse;
	}

exports.displayTargetServerDetails = function (targetServerDetails){
	                var name = targetServerDetails.name;
	                var host = targetServerDetails.host;
	                var port = targetServerDetails.port;
	                var isEnabled = targetServerDetails.isEnabled;
	                var sslInfo = targetServerDetails.sSLInfo;
	                var clientAuthEnabled = null;
	                var sslEnabled = false ;
	                var ignoreValidationErrors = null;
	                var keyAlias = "";
	                var keyStore = "";
	                if ( sslInfo ) {
	                	clientAuthEnabled = sslInfo.clientAuthEnabled;
	                	sslEnabled = sslInfo.enabled;
	                	ignoreValidationErrors = sslInfo.ignoreValidationErrors;
	                	keyAlias = sslInfo.keyAlias;
	                	keyStore = sslInfo.keyStore;
	                }
					console.log("--------  Below are Target Server Information seperated by : --------")
					console.log("");
					console.log("Name : "+name);
					console.log("Host : "+host);
					console.log("Port : "+port);
					console.log("Target Server Enabled : "+isEnabled);
					console.log("Target SSL Enabled : "+sslEnabled);
					if( sslInfo) {
						console.log("Client Auth Enabled : "+ clientAuthEnabled);
						console.log("Ignore Backend SSL Validation Errors : "+ ignoreValidationErrors);
						console.log("Key Alias : "+ keyAlias);
						console.log("Key Store Name : "+ keyStore);
					}
					console.log("*******************************************");

}

exports.showTargetServerOptions = function(){
					console.log(" Please Select Your Option From Below: ");
					console.log(" Press 1 for : Searching a Target Server.");
					console.log(" Press 2 for : Add a New Target Server.");
					console.log(" Press 3 for : Update a Target Server.");
					console.log(" Press 4 for : Delete a Target Server");
					console.log(" Type exit for Closing This Application.");
}

exports.updateTargetServer = function(HOST,pathPrefix,orgName,environment,username,password){
	console.log("Enter a Target Server Name to Update : ");
	var targetServerName = syncPrompt.prompt();
		var options = {
    	'headers': {
			'Accept': 'application/json',
			'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
		}
	} 
	var url = HOST + pathPrefix + orgName+ '/environments/'+environment+'/targetservers/'+targetServerName;
	var res = request('GET',url,options);
	if( res.statusCode != 200) {
		console.error('Error In Getting Entries for Target Server '+ targetServerName+ ". Server responded with below error: ");
		console.log(new Buffer(res.body).toString());
		process.exit(1);	
	}
	var targetServerDetails = JSON.parse(new Buffer(res.body).toString());
	var name = targetServerDetails.name;
	var host = targetServerDetails.host;
	var port = targetServerDetails.port;
	var isEnabled = targetServerDetails.isEnabled;
	var sslInfo = targetServerDetails.sSLInfo;
	var clientAuthEnabled = null;
	var sslEnabled = false ;
	var ignoreValidationErrors = null;
	var keyAlias = "";
	var keyStore = "";

// Prompt Start Update the target server
	console.log("Please provide Target Server Host : ( leave blank if unchanged) ")	;
	var targetServerHost = syncPrompt.prompt();
	if( targetServerHost == "") {
		targetServerHost = host;
	}
	console.log("Please provide Target Server Port: ( leave blank if unchanged) ")	;
	var targetServerPort = syncPrompt.prompt();
	if( targetServerPort == "") {
		targetServerPort = port;
	}
	console.log("Is Target Server Enabled (true/false): ( leave blank if unchanged) ")	;
	var targetServerIsEnabled = syncPrompt.prompt();
	if( targetServerIsEnabled == "") {
		targetServerIsEnabled = isEnabled;
	}
	var targetServerUpdatePayload = '{"name" : "'+targetServerName+'", "host" : "'+targetServerHost+'", "port" : '+targetServerPort;
	targetServerUpdatePayload += ', "isEnabled" : '+ targetServerIsEnabled;
	if ( sslInfo ) {
		targetServerUpdatePayload += ', "sSLInfo" : { "ciphers" : [ ]';
		console.log("Is Target SSL Enabled (true/false): ( leave blank if unchanged) ")	;
		var targetServerSSLEnabled = syncPrompt.prompt();
		if( targetServerSSLEnabled == "") {
			targetServerSSLEnabled = sslInfo.enabled;
		}
		targetServerUpdatePayload += ', "enabled" : '+targetServerSSLEnabled;
	    clientAuthEnabled = sslInfo.clientAuthEnabled;
	    ignoreValidationErrors = sslInfo.ignoreValidationErrors;
	    keyAlias = sslInfo.keyAlias;
	    keyStore = sslInfo.keyStore;
		console.log("Is Client Auth Enabled (true/false): ( leave blank if unchanged) ")	;
		var targetServersClientAuthEnabled = syncPrompt.prompt();
		if( targetServersClientAuthEnabled == "") {
			targetServersClientAuthEnabled = clientAuthEnabled;
		}
		console.log("Key Alias: ( leave blank if unchanged) ")	;
		var targetServerKeyAlias = syncPrompt.prompt();
		if( targetServerKeyAlias == "") {
			targetServerKeyAlias = keyAlias;
		}
		console.log("Key Store: ( leave blank if unchanged) ")	;
		var targetServerKeyStore = syncPrompt.prompt();
		if( targetServerKeyStore == "") {
			targetServerKeyStore = keyStore;
		}
		targetServerUpdatePayload += ', "clientAuthEnabled" : '+targetServersClientAuthEnabled;
		targetServerUpdatePayload += ', "ignoreValidationErrors" : '+true;
		targetServerUpdatePayload += ', "keyAlias" : "'+targetServerKeyAlias+'"';
		targetServerUpdatePayload += ', "keyStore" : "'+targetServerKeyStore+'"';
		targetServerUpdatePayload += ', "protocols" : [ ] }';
	    }
	    targetServerUpdatePayload += '}';
	    console.log("Update Request Payload : "+targetServerUpdatePayload);
	var options = {
					'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								},
					'body' : targetServerUpdatePayload
				}
	var url = HOST + pathPrefix +orgName+ '/environments/'+environment+'/targetservers/'+targetServerName;
	var res = request('PUT',url,options);		
	//console.log(new Buffer(res.body).toString());		
	var targetServerResponse = JSON.parse(new Buffer(res.body).toString());
	console.log("");
	console.log('Update successful! Updated Entries are Below: '); 
	console.log("");
	return targetServerResponse;

}

exports.deleteTargetServer = function(HOST,pathPrefix,orgName,environment,username,password){
// Prompt Start Update the key 
console.log("--------enter the Target Server Name to delete :")
var targetServerName = syncPrompt.prompt();
var answer = syncPrompt.question('Are you sure you want to delete : '+targetServerName+' (y/n) ? ');
console.log("Your Answer is :"+answer);
if( answer == 'y') {
	var options = {
					'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								}
				}
	var url = HOST + pathPrefix +orgName+ '/environments/'+environment+'/targetservers/'+targetServerName;
	var res = request('DELETE',url,options);
	//console.log(new Buffer(res.body).toString());	
	if( res.statusCode == 200) {
		targetServerResponse = JSON.parse(new Buffer(res.body).toString());
		console.log("");
		console.log('Delete successful! '); 
		console.log('-----------------------------------------------------');
		console.log("");
		return targetServerResponse;
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

exports.listAllTargetServers = function(HOST,pathPrefix,orgName,environment,username,password) {
		var options = {
    	'headers': {
		'Accept': 'application/json',
		'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
		}
	} 
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	var url = HOST + pathPrefix + orgName+ '/environments/'+environment+'/targetservers';
	//console.log("URL : "+ url);
	var res = request('GET',url,options);
	//console.log(new Buffer(res.body).toString());
	if( res.statusCode != 200) {
		console.error('Error In Getting Target Server List');
		console.log(new Buffer(res.body).toString());
		process.exit(1);	
	}
	responsePayload = new Buffer(res.body).toString();
	targetServerList = JSON.parse(responsePayload);
	console.log("-------- Below are name of Target Servers in this environment: --------");
	console.log("");
	for ( var i = 0; i <targetServerList.length; i++) {
		var options1 = {
					'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								}
				}
		var url1 = HOST + pathPrefix +orgName+ '/environments/'+environment+'/targetservers/'+targetServerList[i];
		var getResponse = request('GET',url1,options1);
		var getResponsePayload = new Buffer(getResponse.body).toString();
		getResponseJson = JSON.parse(getResponsePayload);
		console.log("Target Server Name :  "+ targetServerList[i] + " , Host : "+ getResponseJson.host);
	}
	console.log("");
	console.log("------------------------------------------------------------");
	console.log("");
}

exports.createTargetServer = function(HOST,pathPrefix,orgName,environment,username,password){
	console.log("Enter a Target Server Name : ");
	var targetServerName = syncPrompt.prompt();
	console.log("Please provide Target Server Host :")	;
	var targetServerHost = syncPrompt.prompt();
	console.log("Please provide Target Server Port:")	;
	var targetServerPort = syncPrompt.prompt();
	console.log("Is Target Server Enabled (true/false):")	;
	var targetServerIsEnabled = syncPrompt.prompt();
	var targetServerUpdatePayload = '{"name" : "'+targetServerName+'", "host" : "'+targetServerHost+'", "port" : '+targetServerPort;
	targetServerUpdatePayload += ', "isEnabled" : '+ targetServerIsEnabled;
	console.log("Is Target SSL Enabled (true/false) :")	;
	var targetServerSSLEnabled = syncPrompt.prompt();
	if ( targetServerSSLEnabled == "true") {
		targetServerUpdatePayload += ', "sSLInfo" : { "ciphers" : [ ]';
		targetServerUpdatePayload += ', "enabled" : '+targetServerSSLEnabled;
		console.log("Is Client Auth Enabled (true/false): ")	;
		var targetServersClientAuthEnabled = syncPrompt.prompt();
		console.log("Key Alias :")	;
		var targetServerKeyAlias = syncPrompt.prompt();
		console.log("Key Store:")	;
		var targetServerKeyStore = syncPrompt.prompt();
		targetServerUpdatePayload += ', "clientAuthEnabled" : '+targetServersClientAuthEnabled;
		targetServerUpdatePayload += ', "ignoreValidationErrors" : '+true;
		targetServerUpdatePayload += ', "keyAlias" : "'+targetServerKeyAlias+'"';
		targetServerUpdatePayload += ', "keyStore" : "'+targetServerKeyStore+'"';
		targetServerUpdatePayload += ', "protocols" : [ ] }';
	    }
	    targetServerUpdatePayload += '}';
	    console.log("Add Request Payload : "+targetServerUpdatePayload);
	var options = {
					'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								},
					'body' : targetServerUpdatePayload
				}
	var url = HOST + pathPrefix +orgName+ '/environments/'+environment+'/targetservers/';
	var res = request('POST',url,options);		
	//console.log(new Buffer(res.body).toString());		
	var targetServerResponse = JSON.parse(new Buffer(res.body).toString());
	console.log("");
	console.log('Create successful! Entries are Below: '); 
	console.log("");
	return targetServerResponse;

}

var request = require('request');
var config = require('./config');
//create server

var prompt = require('prompt');
var syncPrompt = require('readline-sync');
var express = require('express');
var util = require('util');
var async = require('async');

var app = express();
app.listen(3000);

baaSParams = config.baaSParams();
console.log(""Enter Environment: "
var environment = syncPrompt.prompt();
//
// Start the prompt
//
prompt.start();

prompt.get(['environment', 'username', 'password'], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('Environment: ' + result.environment);
    console.log('Username: ' + result.username);
	console.log('Password: ' + result.password);
	
    var options = {
        'method' : 'GET',
        'uri' : baaSParams.HOST + baaSParams.pathPrefix + baaSParams.orgName+ '/environments/'+result.environment+'/keyvaluemaps',
		'headers': {
				'Accept': 'application/json',
				'Authorization':'Basic ' + new Buffer(result.username+":"+result.password).toString('base64')
				}
    }  
		
	request(options, function (error, response, body) {
		if (error) {
		  return console.error('upload failed:', error);
		}

		if( response.statusCode != 200) {
		console.log("GET failed with error: "+ body);
		} else {
			kvmList = JSON.parse(body);
			console.log("-------- Below are name of Key Value Maps in this environment: --------Start");
			console.log("");
			for ( var i = 0; i <kvmList.length; i++) {
				console.log(" KVM Name :  "+ kvmList[i]);
			}
			console.log("");
			console.log("-------- Key Value Maps In This Environment: --------Ends");
			console.log("");
			console.log("");
			console.log("");
			console.log("-------- Enter the KVM Name-------- ");
			
			//userExit
			console.log("Enter 'Y' to continue or Press 'N' to exit ");
			prompt.get(['userInput'], function (err, result2) {
			if(result2.userInput.toUpperCase() == 'Y' ){
				// Prompt starts
				prompt.get(['kvmName'], function (err, res) { 
															
					var option = {
					'method' : 'GET',
					'uri' : baaSParams.HOST + baaSParams.pathPrefix + baaSParams.orgName+ '/environments/'+result.environment+'/keyvaluemaps/'+res.kvmName,
					'headers': {
						'Accept': 'application/json',
						'Authorization':'Basic ' + new Buffer(result.username+":"+result.password).toString('base64')
						}
				    }
					
					console.log(JSON.stringify(option));
					request(option, function (error, response, body) {
						if (error) {
						  return console.error('upload failed:', error);
						  process.exit(1);
						}
						if( response.statusCode != 200) {
						console.log("GET failed with error: "+ body);
						process.exit(1);
						} else {
						   console.log("---- Key Value Entries for "+result.environment+"---------------");	
						    kvmValues = JSON.parse(body);
							entry  = kvmValues.entry;
							
							// entry is an array 
								display(entry);
							var optionEntered =	async.compose(inputKVMOptions);
							console.log( "Option Provided: "+ optionEntered);
							if( optionEntered == 2) {
							updateKVM(baaSParams.HOST,baaSParams.pathPrefix,baaSParams.orgName,result.environment,result.username,result.password,res.kvmName);
							//userExit();
							}
							
						}// end of else
				    });
				
			});
			// Prompt ends					
			}else if (result2.userInput.toUpperCase() == 'N' ){
				process.exit(1);
			}else{				
				 process.exit(1);
				}			
		});
			//abc();	
		}// end of else 
		
	  });
});

kvmDetails = function (HOST,pathPrefix,orgName,environment,username,password){

// Prompt starts
			prompt.get(['kvmName'], function (err, res) { 
															
					var option = {
					'method' : 'GET',
					'uri' : HOST + pathPrefix +orgName+ '/environments/'+environment+'/keyvaluemaps/'+res.kvmName,
					'headers': {
						'Accept': 'application/json',
						'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
						}
				    }
					
					//console.log(JSON.stringify(option));
					request(option, function (error, response, body) {
						if (error) {
						  return console.error('upload failed:', error);
						}
						if( response.statusCode != 200) {
						console.log("GET failed with error: "+ body);
						} else {
						   console.log("---------------");	
						    kvmValues = JSON.parse(body);
							entry  = kvmValues.entry;
							
							// entry is an array 
							 console.log("");
						     console.log("");
								display(entry);
							 console.log("");
						     console.log("");
							updateKVM(HOST,pathPrefix,orgName,environment,username,password,res.kvmName);
							
						}// end of else
				    });
				
			});
			// Prompt ends
			// Prompt starts :: GET enter the one KVM name and one key to get the value

}.bind({baaSParams: baaSParams,result : this.result});


	function updateKVM(HOST,pathPrefix,orgName,environment,username,password,kvmName){


			// Prompt Start Update the key 
			console.log("--------enter the key name and value : seperated and multiple keyValue '#' seperated ---------  Starts")
			prompt.get(['keysValues'], function (err, res) { 
			
			    var keyValues = res.keysValues;
				var entry = [];
				var flag = true;
				var keyVlauesArray = keyValues.split("#");
					for (var i = 0; i < keyVlauesArray.length; i++) {

						var keyValueJsonObj = {
							"name": null,
							"value": null
						};
						if (keyVlauesArray[i].indexOf(":") >= 0) {
							keyValueJsonObj.name = keyVlauesArray[i].split(":")[0];
							keyValueJsonObj.value = keyVlauesArray[i].split(":")[1];
							entry.push(keyValueJsonObj);
						} else {
							console.log("Please give key value : seperated");
							flag = false;
							break;
						}

					}	
			    
				 if(flag){
				 
				 
				    var  keyValuePayload = '{"name" : "'+kvmName+'", "entry" : '+JSON.stringify(entry)+'}';
					 var options = {
							'method' : 'PUT',
							'uri' : HOST + pathPrefix +orgName+ '/environments/'+environment+'/keyvaluemaps/'+kvmName,
							'headers': {
								'content-type': 'application/json',
								'Authorization':'Basic ' + new Buffer(username+":"+password).toString('base64')
								},
							'body' : keyValuePayload
						}
						
						//console.log(JSON.stringify(options));
					    request(options, function (error, response, responseBody) {
						if (error) {
							return console.error('upload failed:', error);
						}
						
						 kvmValues = JSON.parse(responseBody);
						 entry  = kvmValues.entry;
						 console.log("");
						 console.log("");
						 console.log('Updated successful!  .. Starts'); 
							display(entry)
					     console.log('Updated successful!  .. Ends');
						 console.log("");
						 console.log("");
					});
				} // Ends of if condition
			});
			// Prompt Update the key value Ends 

}


function inputKVMOptions (){
menu = 0;	  
prompt.get(['menu'], function (err, result) {

  menu = result.menu;
  
  if ((menu == 0) || (menu == 'exit')){

    userExit();
  
  }else {
  return menu;
  }
  
  
});
}


function display(entry){
			
			console.log("--------  Below are the key and value ':'  seperated -------- Start")
			console.log("");
			for (var i = 0; i < entry.length; i++) {
					console.log(entry[i].name+ " : " +entry[i].value);
					console.log("");
					console.log("********************");
					

			}
			console.log("--------  key and value ':'  seperated --------  Ends");
			console.log(" Please Select Your Option From Below: ");
			console.log(" Press 1 for : Searching a Key /Value .");
			console.log(" Press 2 for : Add/Update Key /Value Entries.");
			console.log(" Press 3 for : Deleting a Key.");
			console.log(" Type exit for Closing This Application.");
}
	
    
	
function userExit(){
	process.exit(1);
}
    
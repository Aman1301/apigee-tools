var syncPrompt = require('readline-sync');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Menu Options
exports.inputMainOptions = function () {
	menu = 0;
	menu = syncPrompt.prompt();
	if ((menu == 'exit')) {
		process.exit(1);
	} else {
		return menu;
	}
}

exports.showMainOptions = function () {
	console.log(" Please Select Your Option From Below: ");
	console.log(" Press 1 for : Using KVM Operations");
	console.log(" Press 2 for : Using Target Server Operations");
	console.log(" Press 3 for : Using Cache Operations");
	console.log(" Press 4 for : Using Analytics Operations");
	console.log(" Type exit for Closing This Application");
}

exports.showKVMOptions = function () {
	console.log(" Please Select Your Option From Below: ");
	console.log(" Press 1 for : Searching for a Key/Value");
	console.log(" Press 2 for : Add/Update Key/Value Entries");
	console.log(" Press 3 for : Deleting a Key/Value");
	console.log(" Press 4 for : Deleting a KVM");
	console.log(" Press 5 for : Switch to another KVM");
	console.log(" Type exit for Closing This Application");
}

exports.showTargetServerOptions = function () {
	console.log(" Please Select Your Option From Below: ");
	console.log(" Press 1 for : Searching for a Target Server");
	console.log(" Press 2 for : Add a New Target Server");
	console.log(" Press 3 for : Update a Target Server");
	console.log(" Press 4 for : Delete a Target Server");
	console.log(" Type exit for Closing This Application");
}

exports.showCacheOptions = function () {
	console.log(" Please Select Your Option From Below: ");
	console.log(" Press 1 for : Searching a Cache.");
	console.log(" Press 2 for : Add a New Cache.");
	console.log(" Press 3 for : Update a Cache.");
	console.log(" Press 4 for : Delete a Cache");
	console.log(" Type exit for Closing This Application.");
}

exports.showAnalyticsOptions = function () {
	console.log(" Please Select Your Option From Below: ");
	console.log(" Press 1 for : API Proxy Analytics");
	console.log(" Press 2 for : Apps Analytics");
	console.log(" Press 3 for : Developer Analytics");
	console.log(" Type exit for Closing This Application");
}
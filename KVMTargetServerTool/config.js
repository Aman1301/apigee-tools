exports.baaSParams = function (environmentName) {
	var fs = require('fs');

	var pathPrefix = '/v1/o/';
	var HOST = '';
	var orgName = '';
	var environment = '';

	var filePath = "./configurations/" + environmentName + ".txt";
	console.log("Environment File Path : " + filePath);

	var fileExists = fs.existsSync(filePath);
	if (!fileExists) {
		console.log("Wrong Environment. Environment Configuration File Not Found !!");
		process.exit(1);
	}

	var fileContent = fs.readFileSync(filePath, "utf8");
	var fileLines = fileContent.split("\r\n");
	for (var i = 0; i < fileLines.length; i++) {
		var fileLine = fileLines[i].split("=");

		switch (i) {
			case 0:
				HOST = fileLine[1];
				break;
			case 1:
				orgName = fileLine[1];
				break;
			case 2:
				environment = fileLine[1];
				break;
		}
	}

	console.log("Loading Config.....");
	console.log("### Host :" + HOST);
	console.log("### Org Name :" + orgName);
	console.log("### Environment :" + environment);

	return {
		HOST : HOST,
		pathPrefix : pathPrefix,
		orgName : orgName,
		environment : environment
	}
};

/*exports.baaSParams = function (environment) {
	var pathPrefix = '/v1/o/';
	var HOST = '';
	var orgName = '';
	if (environment == "apigee") {
		HOST = 'https://apidev-temp.developer.vodafone.com/kvmtoolproxy';
		orgName = 'ORG_APIX_APIGEE';
		environment = 'apigee';
	} else if (environment == "dev") {
		HOST = 'http://172.26.64.136:8080';
		orgName = 'ORG_APIX_APIGEE';
		environment = 'apigee';
	} else if (environment == "stage") {
		HOST = 'http://172.26.64.138:8080';
		orgName = 'Vodafone';
		environment = "staging";
	} else if (environment == "prod") {
		HOST = 'http://172.26.64.141:8080';
		orgName = 'Vodafone';
		environment = "prod";
	} else {
		console.log("Wrong Environment. Allowed values: dev/stage/prod");
		process.exit(1);
	}

	return {
		HOST : HOST,
		pathPrefix : pathPrefix,
		orgName : orgName,
		environment : environment
	}
};*/
//  
//  config/dynamoDB.js
//
//  Created by Walt Zimmerman on 8/28/16.
//

"use strict";

const AWS = require("aws-sdk");

if(process.env.NODE_ENV === "production") {
	AWS.config.update({ region: "us-west-2"});
} else {
	AWS.config.update({ region: "us-west-2", endpoint: "http://localhost:8000" });
}

const dynamodb = new AWS.DynamoDB();

module.exports = dynamodb;
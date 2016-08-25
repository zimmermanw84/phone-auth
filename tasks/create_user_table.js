//  
//  tasks/create_user_table.js
//
//  Created by Walt Zimmerman on 8/28/16.
//

"use strict";

// DB connection
const dynamodb = require("../config/dynamodb");

const params = {
    TableName : "Users",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [
    		{ AttributeName: "id", AttributeType: "S" },
        { AttributeName: "phone_number", AttributeType: "S" },
        { AttributeName: "auth_token", AttributeType: "S" },
        { AttributeName: "verification_code", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
	    {
    		IndexName: "phone_number",
    		KeySchema: [ { AttributeName: "phone_number", KeyType: "HASH" } ],
    		Projection: { ProjectionType: "ALL" },
    		ProvisionedThroughput: { // throughput to provision to the index
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        }
    	},
    	{
    		IndexName: "auth_token",
    		KeySchema: [ { AttributeName: "auth_token", KeyType: "HASH" } ],
    		Projection: { ProjectionType: "ALL" },
    		ProvisionedThroughput: { // throughput to provision to the index
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        }
    	},
    	{
    		IndexName: "verification_code",
    		KeySchema: [ { AttributeName: "verification_code", KeyType: "HASH" } ],
    		Projection: { ProjectionType: "ALL" },
    		ProvisionedThroughput: { // throughput to provision to the index
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        }
    	}
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

module.exports = () => {
	// Create EBS migrations from the api
	dynamodb.createTable(params, (err, data) => {
	    if (err) {
	        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
	    } else {
	        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
	    }
	});
}

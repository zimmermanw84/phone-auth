//  
//  tasks/drop_table.js
//
//  Created by Walt Zimmerman on 8/28/16.
//

"use strict";

// DB connection
const dynamodb = require("../config/dynamodb");

// Drop Table
const drop = (tableName) => {
	dynamodb.deleteTable({ TableName: tableName }, (err, data) => {
		if (err) console.log(err); // an error occurred
    else console.log(data); // successful response
	});
};

drop("Users");
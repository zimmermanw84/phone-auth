//  
//  tasks.js/list_tables.js
//
//  Created by Walt Zimmerman on 8/29/16.
//

"use strict";

// DB connection
const dynamodb = require("../config/dynamodb");

// dynamodb.listTables({}, (err, data) => {
// 	if(err) console.error(err);
// 	else console.log(data);
// });

// dynamodb.describeTable({ TableName: 'Users' }, (err, data) => {
// 	if(err) {
// 		console.error(err);
// 	} else {
// 		console.log(data.Table.GlobalSecondaryIndexes[0].KeySchema);
// 	}
// });

dynamodb.scan({
	TableName: "Users"
}, function(err, data) {
    if (err) console.log(err); // an error occurred
    else console.log(data); // successful response
});
//  
//  models/users.js
//
//  Created by Walt Zimmerman on 8/28/16.
//

"use strict";

/**
* User Schema
*	In this simple user model we are assuming that every user only has one phone_number
* 
*	phone_number { Primary Key }
*	first_name
*	last_name
*	username
*	auth_token
*	verification_code
*/

// DB connection
const dynamodb = require("../config/dynamodb");

// Promise
const Promise = require("q").Promise;

// Table name
const TABLE_NAME = "Users";

// Auth token generator
const genToken = require("../utils/gen-token");

module.exports = class User {

	constructor(userData) {
		this.phone_number = userData.phone_number || null;
		this.first_name = userData.first_name || null;
		this.last_name = userData.last_name || null;
		this.username = userData.username || null;
		this.auth_token = userData.auth_token || null;
		this.verification_code = userData.verification_code || null;
	};

	/**
	* save {function}
	* Create a user based on user data input
	*/
	save() {
		return Promise((resolve, reject) => {
			if(!this.phone_number) reject(new Error("No Phone Number Given"));

			dynamodb.putItem({
				TableName: TABLE_NAME,
				Item: {
					phone_number: { S: this.phone_number },
					auth_token: { S: genToken(this.phone_number) },
				}
			}, (err, userData) => {
				if(err) reject(err);
				else resolve(userData);
			});

		});
	};

	/**
	* update {function}
	* @param userData - data to update
	* Update a user based on user data input
	*/
	update(userData) {};

	/**
	* findBy {function}
	* @param indexName - Index to query by
	* @param searchData - Data to search for
	* Update a user based on user data input
	*/
	findBy(indexName, searchData) {};
};
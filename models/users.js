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

// Unique ID Generator
const uuid = require('node-uuid');

module.exports = class User {

	constructor(userData) {
		if(userData) {
			this.id = uuid.v4();
			this.phone_number = userData.phone_number || null;
			this.first_name = userData.first_name || null;
			this.last_name = userData.last_name || null;
			this.username = userData.username || null;
			this.auth_token = userData.auth_token || null;
			this.verification_code = userData.verification_code || null;
			this.verification_code_created_at = null;
		};
	};

	/**
	* save {function}
	* Create a user based on user data input
	*/
	save() {
		return Promise((resolve, reject) => {
			if(!this._isValidPhoneNumber(this.phone_number)) reject(new Error("No Phone Number Given"));

			dynamodb.putItem({
				TableName: TABLE_NAME,
				Item: {
					id: { S: this.id },
					phone_number: { S: this.phone_number },
					auth_token: { S: genToken(this.phone_number) }
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
	findBy(keyName, queryValue) {
		let queryObj = {
			TableName: TABLE_NAME,
			IndexName: keyName, // our keyname is our indexname
			KeyConditions: {},
			Select: 'ALL_ATTRIBUTES',
		};
		// Add search Key conditions
		queryObj.KeyConditions[keyName] = {
			ComparisonOperator: "EQ",
			AttributeValueList: [ { S: queryValue } ]
		};

		return Promise((resolve, reject) => {
			dynamodb.query(queryObj, (err, userData) => {
				if(err || userData["Count"] > 1 /* should only return one user */) {
					reject(err);
				} else {
					// Add attributes to model
					// Wrap if data is returned
					if(userData.Count > 0) {
						this._addDataToModel(userData.Items[0]);
						resolve(userData);
					} else {
						resolve(null);
					}
				}
			});
		});
	};

	/**
	* _isValidPhoneNumber {function}
	* @param phoneNumber - phone number
	* Check to see if phone numbe is valid
	*/
	_isValidPhoneNumber(phoneNumber) {
		// Some phonenumber validation logic
		// Better logic than this WIP:
		return (phoneNumber && phoneNumber.length > 8);
	};

	/**
	* genVerificationCode {function}
	* generate verification code
	*/
	genVerificationCode() {
		this.verification_code = (Math.floor(Math.random() * (999999 - 1 + 1) + 1)).toString();
		this.verification_code_created_at = (new Date()).toString();

		let queryObj = {
			TableName: TABLE_NAME,
			Key: { id: { S: this.id } },
			AttributeUpdates: {
				verification_code: {
					Action: "PUT",
					Value: { S: this.verification_code }
				},
				verification_code_created_at: {
					Action: "PUT",
					Value: { S: this.verification_code_created_at }
				}
			}
		};

		return Promise((resolve, reject) => {
			dynamodb.updateItem(queryObj, (err, userData) => {
				if(err) reject(err);
				else resolve(userData);
			});
		});
	};

	/**
	* _addDataToModel {function}
	* Adds data to model after data returned from dynamo
	*/
	_addDataToModel(userData) {
		this.id = userData.id.S;
		this.phone_number = userData.phone_number.S;
		this.first_name = (userData.first_name) ? userData.first_name.S : null;
		this.last_name = (userData.last_name) ? userData.last_name.S : null;
		this.username = (userData.username) ? userData.username.S : null;
		this.auth_token = (userData.auth_token) ? userData.auth_token.S : null;
		this.verification_code = (userData.verification_code) ? userData.verification_code.S : null;
		this.verification_code_created_at = (userData.verification_code_created_at) ? userData.verification_code_created_at.S : null;
	};
};
//  
//  config/twilio.js
//
//  Created by Walt Zimmerman on 8/28/16.
//

"use strict";

let accountSid;
let authToken;
let twilioPhone;

// Twilio Credentials 
if(process.env.NODE_ENV === "production") {
	accountSid = process.env.TWILIO_ACCOUNT_SID;
	authToken = process.env.TWILIO_AUTH_TOKEN;
	twilioPhone = process.env.TWILIO_PHONE;
} else {
	let creds = require("./twilioCreds");
	accountSid = creds.ACCOUNT_SID;
	authToken = creds.AUTH_TOKEN;
	twilioPhone = creds.TWILIO_PHONE
}

// Promise
const Promise = require("q").Promise;

//require the Twilio module and create a REST client 
const twilio = require('twilio');
const client = new twilio.RestClient(accountSid, authToken);

module.exports = (numberTo, verificationNum) => {
	return Promise((resolve, reject) => {
		client.messages.create({
			body: `Hello your verification number is ${verificationNum}. It's good for 5 min only!`,
			to: `+1${numberTo}`,
			from: `+1${twilioPhone}` // Current Twilio Number
		}, (err, message) => {
			if(err) reject(err);
			else resolve(message);
		})
	});
};
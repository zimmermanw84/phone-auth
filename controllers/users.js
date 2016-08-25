//  
//  controllers/users.js
//
//  Created by Walt Zimmerman on 8/24/16.
//
"use strict";
// Models
const User = require("../models/users");

// Twilio Client
const twilioClient = require("../config/twilio");

/*
  =====================================================================================
  User userPostHandler

  Create user
  	- First check if user is created already
  	- If not create user
			- send text
  	- If so reissue verification token
  		- update user
  		- send text
  =====================================================================================
*/

const userPostHandler = (req, res, next) => {
	// Add restaurant data to model
	let user = new User(req.body);

	let userExists = false;

	// First check for user
	user
		.findBy("phone_number", req.body.phone_number)
		.then((u) => {
			if(u) {
				// user exists
				userExists = true;
				return user.genVerificationCode();
				// Create and update random code
			} else {
			// Not exists
				return user.save().then(() => { return user.genVerificationCode(); });
			}
		})
		.then(() => {
			// Send SMS
			return twilioClient(user.phone_number, user.verification_code);
		})
		.then(() => {
			return res.status((userExists) ? 200 : 201).json(user);
		})
		.catch((err) => {
			console.error(err.stack);
			return res.status(400).send(err);
		});
};

/*
  =====================================================================================
  User getUserByNumberHandler

  Get user by phone number
  =====================================================================================
*/

const getUserByNumberHandler = (req, res, next) => {
	// Empty user for DB api
	let user = new User();

	user
		.findBy("phone_number", req.params.number)
		.then((u) => {
			if(!user) {
				return res.status(404).send();
			}

			return res.json(user);
		})
		.catch((err) => {
			console.error(err.stack);
			return res.status(400).send(err);
		});
};

// @public API
module.exports = {
	userPostHandler,
	getUserByNumberHandler
};
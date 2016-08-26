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
			return res.status((userExists) ? 200 : 201).json({ phone_number: user.phone_number });
		})
		.catch((err) => {
			console.error(err.stack);
			return res.status(400).json({ error: err.message});
		});
};

/*
  =====================================================================================
  User getUserByNumberHandler

  Get user by phone number
  =====================================================================================
*/

const getUserByNumberHandler = (req, res, next) => {
	// Make sure currentUser(from auth) Phonenumber matches params number
	if(req.currentUser.phone_number !== req.params.number) return res.status(401).send();

	// Empty user for DB api
	let user = new User();

	user
		.findBy("phone_number", req.params.number)
		.then((u) => {
			if(!u) {
				return res.status(404).send();
			} else {
				return res.json(user.serialize());
			}
		})
		.catch((err) => {
			console.error(err.stack);
			return res.status(400).send(err);
		});
};

/*
  =====================================================================================
  User verifyUserHandler

  Exchange verify code for auth_token
  =====================================================================================
*/

const verifyUserHandler = (req, res, next) => {
	if(!req.body.verification_code) return res.status(403).send();
	let user = new User();

	user
		.findBy("verification_code", req.body.verification_code)
		.then((u) => {
			// Check phone_numbers match and then send auth_token
			if(u && (user.phone_number === req.params.number) &&
				// Current expiration of verification code is 5 min
				(isVerificationCodeValid(user.verification_code_created_at))
				) {
				return res.json({authorization: user.auth_token});
			} else {
				// None shall pass
				return res.status(401).send();
			}
		})
		.catch((err) => {
			console.error(err.stack);
			return res.status(400).send();
		});
};

/*
  =====================================================================================
  User userPutHandler

  Update user
  =====================================================================================
*/

const userPutHandler = (req, res, next) => {
	// First get user
	let user = new User();
	let userCanUpdate = true;

	user
		.findBy("phone_number", req.params.number)
		.then((u) => {
			if(!u) return res.status(404).send();
			// Check if user found matched auth_user
			if(user.phone_number === req.params.number) {
				// then update user
				return user.update(req.body);
			} else {
				userCanUpdate = false;
				return res.status(401).send();
			}
		})
		.then((u) => {
			if(userCanUpdate) {
				return res.status(202).send();
			}
		})
		.catch((err) => {
			console.error(err.stack);
			return res.status(400).send();
		});

};

/*
  =====================================================================================
  HELPERS
  =====================================================================================
*/
const minFromCreated = (min, timeCreated) => {
	// Now
	let created = new Date(timeCreated);
	// N min from now
  return created.setMinutes(created.getMinutes() + min);
};

const isVerificationCodeValid = (timeCreated) => {
	return (minFromCreated(5, timeCreated) > new Date(timeCreated));
};

// @public API
module.exports = {
	userPostHandler,
	getUserByNumberHandler,
	verifyUserHandler,
	userPutHandler
};
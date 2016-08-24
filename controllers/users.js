//  
//  controllers/users.js
//
//  Created by Walt Zimmerman on 8/24/16.
//
"use strict";
// Models
const User = require("../models/users");

/*
  =====================================================================================
  User userPostHandler

  Create user
  =====================================================================================
*/

const userPostHandler = (req, res, next) => {
	// Add restaurant data to model
	let user = new User(req.body);

	user
		.save()
		.then((user) => {
			return res.status(201).json(user);
		})
		.catch((err) => {
			console.error(err.stack);
			return res.status(400).send(err);
		});
};

module.exports = { userPostHandler };
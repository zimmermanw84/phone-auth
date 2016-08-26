//  
//  controllers/auth.js
//
//  Created by Walt Zimmerman on 8/24/16.
//
"use strict";
// Models
const User = require("../models/users");

/*
  =====================================================================================
  User Authorize

  A naive implementation
  =====================================================================================
*/

const authorize = (req, res, next) => {
	if(!req.headers.authorization) return res.status(401).send();

	let user = new User();

	user
		.findBy("auth_token", req.headers.authorization)
		.then((u) => {
			if(u) {
				// User exists
				req.currentUser = user;
				return next()
			} else {
				// None shall pass
				return res.status(401).send();
			}
		})
		.catch((err) => {
			console.error(err.stack);
			return res.status(400).send(err);
		});
};

module.exports = { authorize };
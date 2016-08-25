//  index router
//  routes/index.js
//
//  Created by Walt Zimmerman on 8/24/16.
//

"use strict";

// Deeps
const express = require('express');
const router = express.Router();

// Controllers
const userController = require("../controllers/users");

// For heartbeat test
router.get('/', (req, res, next) => {
	// for testing
	return res.json({ message: "Success" });
});

router.get('/migrations', (req, res, next) => {
	// Run migrations
	require("../tasks/create_user_table")();
	return res.status(200).send();
});

// Get user by phone number
router.get('/users/:number', userController.authorize, userController.getUserByNumberHandler);

// Create AND Trigger SMS
router.post('/users', userController.userPostHandler);

// Send verification code to retrieve auth_token
router.post('/users/:number/verify', userController.verifyUserHandler);

module.exports = router;
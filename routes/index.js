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
const authController = require("../controllers/auth");

// For heartbeat test
router.get('/', (req, res, next) => {
	// for testing
	return res.json({ message: "Success" });
});

// Get user by phone number
router.get('/users/:number', authController.authorize, userController.getUserByNumberHandler);

// Create AND Trigger SMS
router.post('/users', userController.userPostHandler);

// Send verification code to retrieve auth_token
router.post('/users/:number/verify', userController.verifyUserHandler);

// Update user
router.put('/users/:number' , authController.authorize, userController.userPutHandler);

module.exports = router;
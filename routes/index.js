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

// Get user by phone number
router.get('/users/numbers/:number', userController.getUserByNumberHandler);

// Users
router.post('/users', userController.userPostHandler);

module.exports = router;
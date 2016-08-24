//  index router
//  routes/index.js
//
//  Created by Walt Zimmerman on 8/24/16.
//

"use strict";

// Deeps
const express = require('express');
const router = express.Router();

// For heartbeat test
router.get('/', (req, res, next) => {
	// for testing
	return res.json({ message: "Success" });
});

module.exports = router;
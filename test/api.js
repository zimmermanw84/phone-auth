//  
//  test/api.js
//
//  Created by Walt Zimmerman on 8/28/16.
//

"use strict";
const expect = require('chai').expect;
const supertest = require('supertest');
// Model
const User = require("../models/users");
// Pass Data
const TEST_USER_DATA_PASS = { "phone_number" : "1231234567" }
// App
const app = require('../app');
// Api
const api = supertest(app);

let TEST_USER;

describe(`Test to ensure the API is returning correct status codes and data`, () => {
	// Setup
	before(() => {
		TEST_USER = new User(TEST_USER_DATA_PASS);
		return TEST_USER.save().then(() => { return TEST_USER.genVerificationCode() })
	});

	it(`GET /users/:phone_number should return 401 with no authorization token`, (done) => {
		api.get('/users/1231234567')
			.expect(401, done);
	})

	after(() => {
		TEST_USER.destroy();
	})
});
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

let verification_code;

describe(`Test to ensure the API is returning correct status codes and data`, () => {
	// Setup
	before(() => {
		TEST_USER = new User(TEST_USER_DATA_PASS);
		return TEST_USER.save().then(() => { return TEST_USER.genVerificationCode() })
	});

	it(`GET /users/:phone_number should return 401 with no authorization token`, (done) => {
		api.get('/users/1231234567')
			.expect(401, done);
	});

	it(`GET /users/:phone_number should return 200 with authorization`, (done) => {
		// Get users auth and setup for verification_code test
		TEST_USER.findBy('phone_number', "1231234567")
			.then((u) => {
				// Setup for next test
				verification_code = u.verification_code;
				api.get('/users/1231234567')
					.set("authorization", u.auth_token)
					.expect(200, done);
			})
			.catch((err) => {
				// should not reach this block
				expect(err).to.be.undefined;
				done();
			});
	});

	// it(`POST /users/:phone_number/verify should return 200`)

	// it(`POST /users/:phone_number/verify should return authorization token`)
	// it(`POST /users/:phone_number/verify should return 401 with invalid verification_code`)

	after(() => {
		TEST_USER.destroy();
	})
});
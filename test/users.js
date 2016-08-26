//  
//  test/users.js
//
//  Created by Walt Zimmerman on 8/28/16.
//

"use strict";
const expect = require('chai').expect;

// Model
const User = require("../models/users");
// Fail Data
const TEST_USER_DATA_FAIL = { "phone_number" : "asdfkff4sd" }
// Pass Data
const TEST_USER_DATA_PASS = { "phone_number" : "1231234567" }

let TEST_USER;

describe(`User Unit Tests`, () => {
	it(`Should fail User#save when given invalid phone_number`, (done) => {
		let FAIL_USER = new User(TEST_USER_DATA_FAIL);

		FAIL_USER
			.save()
			.then((u) => {
				// Should not hit this block
				expect(u).to.be.undefined;
				done();
			})
			.catch((err) => {
				expect(err.message).to.equal("Field not valid: phone_number"); 
				done();
			});
	});

	it(`Should create a user with a valid phone_number`, (done) => {
		TEST_USER = new User(TEST_USER_DATA_PASS);

		TEST_USER.save()
			.then((u) => {
				expect(u).to.not.be.null;
				done()
			})
			.catch((err) => {
				// should not reach this block
				expect(err).to.be.undefined;
				done();
			});
	});

	it(`Should have a auto generated GUID`, (done) => {
		expect(TEST_USER.id).to.not.be.null;
		done();
	});

	it(`User#findBy should find user by index and value `, (done) => {
		let USER_API = new User();

		USER_API.findBy("phone_number", TEST_USER.phone_number)
			.then((u) => {
				// Now USER_API is populated with user findby data
				expect(USER_API.id).to.equal(TEST_USER.id);
				done();
			})
			.catch((err) => {
				// should not reach this block
				expect(err).to.be.undefined;
				done();
			});
	});

	it(`User#serialize should return all public properties uf user object`, (done) => {
		let publicObject = TEST_USER.serialize();
		expect(publicObject).to.have.all.keys('phone_number', 'id', 'first_name', 'last_name', 'username');
		expect(publicObject.verification_code).to.be.undefined;
		done();
	});

	it(`User#genVerificationCode should add verification_code to user`, (done) => {
		TEST_USER
			.genVerificationCode()
			.then((u) => {
				return TEST_USER.findBy("phone_number", TEST_USER.phone_number);
			})
			.then((u) => {
				expect(u.verification_code).to.not.be.null;
				expect(u.verification_code).to.be.a("string");
				done();
			})
			.catch((err) => {
				// should not reach this block
				expect(err).to.be.undefined;
				done();
			});
	});

	it(`User#destroy should delete user `, (done) => {
		TEST_USER.destroy()
			.then(() => {
				// Now look for user
				// Instance should have cached phone_number
				return TEST_USER.findBy("phone_number", TEST_USER.phone_number);
			})
			.then((u) => {
				expect(u).to.be.null;
				done();
			})
			.catch((err) => {
				// should not reach this block
				expect(err).to.be.undefined;
				done();
			});
	});

});
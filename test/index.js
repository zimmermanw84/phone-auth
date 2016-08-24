//  
//  test/index.js
//
//  Created by Walt Zimmerman on 8/28/16.
//

"use strict";
const expect = require('chai').expect;
const supertest = require('supertest');

// App
const app = require('../app');

// Api
const api = supertest(app);

// Sanity Check
describe(`Sanity Check`, () => {
	it(`Should return a 200 status code`, (done) => {
		api.get('/').expect(200, done);
	});
});
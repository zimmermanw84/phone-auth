//  
//  utils/gen-token.js
//
//  Created by Walt Zimmerman on 8/28/16.
//
"use strict";

const crypto = require('crypto');
const MD5 = crypto.createHash("MD5")
const keyStart = MD5.digest().slice(0, 8);

// @public Api
module.exports = (string) => {
	let cipher = crypto.createCipheriv('des-cbc', keyStart, keyStart);
	let SECRET = Math.floor((Math.random() * 100000) + 1).toString();
	let crypted = cipher.update(SECRET + string, 'utf8', 'hex');

  crypted += cipher.final('hex');
  return crypted;
};
const crypto = require('crypto');

const token = crypto.randomBytes(8).toString('hex');

console.log(token);
const password = '123123123';
console.log(password.length);

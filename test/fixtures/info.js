var requestModule = require('supertest-as-promised');

exports.request = requestModule('http://localhost:2000');

exports.secret = 'jd83ks7645jf43fge343';

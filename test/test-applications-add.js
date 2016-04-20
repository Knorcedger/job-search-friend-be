import test from 'ava';
import setup from './fixtures/setup';
var info = require('./fixtures/info');
var addUser = require('./fixtures/add-user');
var loginUser = require('./fixtures/login-user');
var helpers = require('./helpers/helpers');

var user;
var token;

test.before('setup', async t => {
	try {
		var done = await setup();
		user = await addUser('member');
		token = await loginUser(user._id);
		t.pass();
	} catch(error) {
		t.fail(error);
	}
});

test('add', async t => {
	let data = {
		date: '2016-06-12',
		position: 'The best job',
		company: 'Super space',
		contacts: [{
			name: 'Takis',
			surname: 'Tsoukalas',
			email: 'takis@example.com',
			isRecruiter: true,
			recruiterCompany: 'Thrylos'
		}],
		adLink: 'http://example.com',
		salary: {
			from: '1000',
			to: '2000'
		},
		notes: 'Many',
		nextStep: 'Dunno',
		cvTitle: 'My new CV'
	};

	let requestData = Object.assign({}, data, {
		secret: info.secret,
		token: token
	});

	let verifyData = data;
	verifyData.status = 'notApplied';

	const res = await info.request
		.post('/applications/add')
		.send(requestData);

	helpers.checkSuccess(t, res);
	// date is returned in full version, so dont check it
	delete verifyData.date;
	helpers.isApplication(t, res.body.data, verifyData);
});

// test('username-invalid-length', async t => {
// 	const res = await info.request
// 		.post('/authentications/register')
// 		.send({
// 			secret: info.secret,
// 			username: 'abc',
// 			password: '1234',
// 			email: 'member@example.com'
// 		});
//
// 	helpers.checkFail(t, res, 'username.INVALID_LENGTH');
// });
//
// test('password-invalid-length', async t => {
// 	const res = await info.request
// 		.post('/authentications/register')
// 		.send({
// 			secret: info.secret,
// 			username: 'abcd',
// 			password: '123',
// 			email: 'member@example.com'
// 		});
//
// 	helpers.checkFail(t, res, 'password.INVALID_LENGTH');
// });
//
// test('email-invalid', async t => {
// 	const res = await info.request
// 		.post('/authentications/register')
// 		.send({
// 			secret: info.secret,
// 			username: 'abcd',
// 			password: '1234',
// 			email: 'member'
// 		});
//
// 	helpers.checkFail(t, res, 'email.INVALID');
// });

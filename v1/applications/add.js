require('../../schemas/userSchema');
require('../../schemas/applicationSchema');
var db = require('apier-database');
var User = db.mongoose.model('User');
var Application = db.mongoose.model('Application');
var reqlog = require('reqlog');
var validationsRunner = require('apier-validationsrunner');
var validator = require('validator');

module.exports = function(app) {
	app.endpoint({
		methods: ['get', 'post'],
		url: '/applications/add',
		permissions: ['member'],
		middlewares: [validate],
		callback: function(req, res) {
			main(req, res, this);
		}
	});
};

/**
 * The endpoint validations middleware
 * @method validate
 * @param  {object}   req  The request object
 * @param  {object}   res  The response object
 * @param  {Function} next The next function
 */
function validate(req, res, next) {
	var validations = {
		date: {
			INVALID_LENGTH: req.requestData.date.length === 10,
			INVALID_DATE: validator.isDate(req.requestData.date)
		},
		position: {
			EMPTY: Boolean(req.requestData.position)
		},
		salaryFrom: {
			NOT_NUMBER: req.requestData.salary &&
				req.requestData.salary.from &&
				validator.isNumeric(req.requestData.salary.from) || true
		},
		salaryTo: {
			NOT_NUMBER: req.requestData.salary &&
				req.requestData.salary.to &&
				validator.isNumeric(req.requestData.salary.to) || true
		}
	};

	validationsRunner(req, res, next, validations);
}

/**
 * The main endpoint function
 * @method main
 * @param  {object} req The request object
 * @param  {object} res The response object
 * @param  {object} self Use self.send to send back data
 */
function main(req, res, self) {
	reqlog.info('applications.add');

	var application = new Application();

	application.create(req, res, {
		date: req.requestData.date,
		position: req.requestData.position,
		company: req.requestData.company || '',
		contacts: req.requestData.contacts || [],
		adLink: req.requestData.adLink || '',
		salary: {
			from: req.requestData.salary.from || 0,
			to: req.requestData.salary.to || 0
		},
		notes: req.requestData.notes || '',
		status: req.requestData.status || 'notApplied',
		nextStep: req.requestData.nextStep || '',
		cvTitle: req.requestData.cvTitle || ''
	}).then(function(application) {
		var user = new User();

		var applications = req.activeUser.applications;
		applications.push(application._id);

		user.findByIdAndUpdate(req, res, req.activeUser._id, {
			applications: applications
		})
			.then(function(result) {
				self.send(application);
			});
	});
}

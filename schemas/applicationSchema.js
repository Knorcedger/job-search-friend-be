var db = require('apier-database');
var schemaExtender = require('mongoose-schema-extender');

var applicationSchema = new db.mongoose.Schema({
	date: {type: Date, required: true},
	position: {type: String, required: true},
	company: {type: String},
	contacts: [{
		name: {type: String},
		surname: {type: String},
		email: {type: String},
		isRecruiter: {type: Boolean},
		recruiterCompany: {type: String}
	}],
	adLink: {type: String},
	salary: {
		from: {type: Number, default: 0},
		to: {type: Number}
	},
	notes: {type: String},
	status: {type: String, required: true, default: 'notApplied', enum: [
		'gotOffer', 'rejected', 'inProgress', 'notApplied'
	]},
	nextStep: {type: String},
	cvTitle: {type: String}
}, {
	collection: 'applications'
}, {
	versionKey: false
});

// says which attributes each user role can see
applicationSchema.statics.permissions = function() {
	return {
		_id: ['null'],
		date: ['member'],
		position: ['member'],
		company: ['member'],
		contacts: ['member'],
		adLink: ['member'],
		salary: ['member'],
		notes: ['member'],
		status: ['member'],
		nextStep: ['member'],
		cvTitle: ['member'],
		__v: []
	};
};

applicationSchema.methods.create = function(req, res, save, populations) {
	return schemaExtender.create(req, res, db.mongoose, applicationSchema,
		'Application', save, populations);
};

applicationSchema.methods.findOne = function(req, res, query, populations) {
	return schemaExtender.findOne(req, res, db.mongoose, applicationSchema,
		'Application', query, populations);
};

applicationSchema.methods.findById = function(req, res, id, populations) {
	return schemaExtender.findById(req, res, db.mongoose, applicationSchema,
		'Application', id, populations);
};

applicationSchema.methods.findByIdAndRemove = function(req, res, id) {
	return schemaExtender.findByIdAndRemove(req, res, db.mongoose,
		applicationSchema, 'Application', id);
};

applicationSchema.methods.find = function(req, res, query, populations) {
	return schemaExtender.find(req, res, db.mongoose, applicationSchema,
		'Application', query, populations);
};

applicationSchema.methods.findByIdAndUpdate = function(req, res, id, update,
	options, populations) {
	return schemaExtender.findByIdAndUpdate(req, res, db.mongoose,
		applicationSchema, 'Application', id, update, options, populations);
};

applicationSchema.methods.findOneAndUpdate = function(req, res, query, update,
	options, populations) {
	return schemaExtender.findOneAndUpdate(req, res, db.mongoose,
		applicationSchema, 'Application', query, update, options, populations);
};

module.exports = db.mongoose.model('Application', applicationSchema);

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
	email: String,
	password: String,
	collectedParks: [{type: String}]
}, { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
	email: {type: String, unique: true},
	password: String,
	collectedParks: [{type: String}]
}, { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);

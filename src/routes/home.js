var secrets = require('./secrets.js');
var User = require('..models/user');
const mongoose = require('mongoose');

mongoose.connect(secrets.mongo_connection, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

module.exports = function (router) {

	router.get('/', function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    return router;
}

module.exports = function (app, router) {
    app.use('/api', require('./server.js')(router));
};

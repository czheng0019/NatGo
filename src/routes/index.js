module.exports = function (app, router) {
  app.use("/api", require("../server/api/server.js")(router));
};

module.exports = function (app, router) {
  app.use("/api", require("../server/api/index.js")(router));
};

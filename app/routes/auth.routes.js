require('dotenv').config();
const { checkDuplicateUsernameOrEmail } = require("../middleware/verifySignUp");
const { signup, signin } = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.FRONT_ORIGIN);
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup", [checkDuplicateUsernameOrEmail], signup);

  app.post("/api/auth/signin", signin);
};
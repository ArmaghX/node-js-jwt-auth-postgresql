require('dotenv').config();
const { verifyToken } = require("../middleware/authJwt");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.FRONT_ORIGIN);
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/test/all", controller.allAccess);
  
  app.get(
    "/api/test/user",
    [verifyToken],
    controller.userBoard
  );
};
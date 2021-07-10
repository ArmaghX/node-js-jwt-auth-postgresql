const { pool } = require("../services/db.config");

exports.checkDuplicateUsernameOrEmail = (req, res, next) => {
  const lowerCaseUsername = req.body.username.toLowerCase();
  const findUser = {
    username: lowerCaseUsername,
    email: req.body.email
  };
  const values = [findUser.username, findUser.email]
  const query = `
  SELECT * FROM users WHERE username = $1 OR email = $2`;
  pool.connect((error, client, release) => {
    if(error) {
      return console.error('Error acquiring client', error.stack)
    }
    client.query(query, values, (err, result) => {
      release();
      if(err) {
        console.log(err.message);
        return res.status(400).json({err});
      }
      const user = result.rows[0];
      if(!user) {
        next();
      } else if(user.username === findUser.username){
        res.status(400).send({ message: "Failed! Username is already in use!" });
        return;
      } else if(user.email === findUser.email){
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
    })
  });
};
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../services/db.config");
require('dotenv').config();

const ONEDAY = 86400;

exports.signup = (req, res) => {
  const lowerCaseUsername = req.body.username.toLowerCase();
  const newUser = {
    username: lowerCaseUsername,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  };
  const query = `
  INSERT INTO users(username, email, password) 
  VALUES($1,$2,$3) RETURNING *`;
  const values = [newUser.username, newUser.email, newUser.password];
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
      const token = jwt.sign(
        { id: user.id }, 
        process.env.SECRET, 
        { expiresIn: ONEDAY }
      );
      return res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token,
        message: "User was registered successfully!"
      });
    });
  });
};

exports.signin = (req, res) => {
  const lowerCaseUsername = req.body.username.toLowerCase();
  const findUser = {
    username: lowerCaseUsername
  };
  const query = `
  SELECT * FROM users WHERE username = $1`;
  const values = [findUser.username];
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
      if(!user){
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
        });
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: ONEDAY
      });
      res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token
      });
    });
  });
};
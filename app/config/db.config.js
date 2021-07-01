require('dotenv').config()

module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: process.env.DB_PASS,
    DB: process.env.DB_PG,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
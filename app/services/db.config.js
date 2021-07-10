const { Pool, Client } = require('pg');
require('dotenv').config()

const config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('Connected to the Database');
});

const createTables = () => {
  const userTable = `CREATE TABLE IF NOT EXISTS
    users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(120) NOT NULL,
      email VARCHAR(120) NOT NULL,
      password VARCHAR(120) NOT NULL
    )`;
  pool.query(userTable)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
};

pool.on('remove', () => {
  console.log('Client Removed');
  process.exit(0);
});

module.exports = {
  pool,
  createTables
};

require('make-runnable');
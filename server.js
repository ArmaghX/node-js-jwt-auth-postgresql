const express = require('express');
const db = require("./app/models");

const app = express();

app.use(express.json());


const User = db.user;

/****
 * [Only for Development]
  Initializes Sequelize droping existing tables and re-syncs DB
      =>
 */

db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
});

function initial() {
    User.create({
      username: 'MigraCode-Superuser',
      email: 'migracode@testdb.com',
      password: 'mg1'
    });
}

/****
 * [During Production] Initializes Sequelize
 *    => db.sequelize.sync()
 */


// simple routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to MigraCode Auth application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

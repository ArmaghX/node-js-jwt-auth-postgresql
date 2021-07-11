const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// simple routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to MigraCode JWT Auth application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const express = require("express");

const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs'); // Require EJS

// Initialize Express
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const port = 5000;

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

// Initialize server
app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});

module.exports = app;

const express = require("express");
//const sqlite3 = require('sqlite3');
const path = require('path');
const bodyParser = require('body-parser');
//const ejs = require('ejs'); // Require EJS

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

/*// Configure SQLite database
const db = new sqlite3.Database('./database.db');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS names (firstName TEXT COLLATE NOCASE, lastName TEXT COLLATE NOCASE, visited INT DEFAULT 0, class TEXT COLLATE NOCASE, lastLoginTime INT DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS login_logs (id INTEGER PRIMARY KEY, user_id TEXT, login_time DATETIME);")
});
*/
// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/test.html'));
});

// Initialize server
app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});

module.exports = app;

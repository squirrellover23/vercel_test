const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
import { sql } from '@vercel/postgres';


// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

async function makeRunQuery(query, retfunc){
  try {
    await sql`${query}`;
  } catch (error) {
    retfunc(error);
    return;
  }
  retfunc(null)
}

async function makeRetQuery(query, retfunc){
  try {
    var response = await sql`${query}`;
  } catch (error) {
    retfunc(error, null);
  }
  retfunc(null, response)
}
/*
// Configure SQLite database
const db = new sqlite3.Database('./database.db');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS names (firstName TEXT COLLATE NOCASE, lastName TEXT COLLATE NOCASE, visited INT DEFAULT 0, class TEXT COLLATE NOCASE, lastLoginTime INT DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS login_logs (id INTEGER PRIMARY KEY, user_id TEXT, login_time DATETIME);")
});


*/

const createNameQ = `CREATE TABLE IF NOT EXISTS names (firstName TEXT COLLATE "C", lastName TEXT COLLATE "C", visited INT DEFAULT 0, class TEXT COLLATE "C", lastLoginTime INT DEFAULT 0);`
const createLoginsTableQ = `CREATE TABLE IF NOT EXISTS login_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  login_time TIMESTAMP
);`

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/createTables", async (req, res) =>{
  makeRetQuery(createLoginsTableQ, (err, ret) =>{
    if (err){
      res.status(500).send(err)
    }
  })
  makeRetQuery(createNameQ, (err, ret) => {
    if (err){
      res.status(500).send(err)
    } else {
      res.status(200).json({ ret })
    }
  })


  
  /*
  var message = null;
  makeRetQuery("CREATE TABLE IF NOT EXISTS names (firstName TEXT COLLATE NOCASE, lastName TEXT COLLATE NOCASE, visited INT DEFAULT 0, class TEXT COLLATE NOCASE, lastLoginTime INT DEFAULT 0);", (err, res)=>{
    if (err){
      message=err
    } else {
      message=row
    }});
  makeRetQuery("CREATE TABLE IF NOT EXISTS login_logs (id INTEGER PRIMARY KEY, user_id TEXT, login_time DATETIME);", (err, res)=>{
    if (err){
      message=err
    } else {
      message=row
    }})
  if (!message){
    res.status(500).send('Error creating table');
  } else {
    res.status(200).json(message)
  }
  */
});



app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/test.html'));
});

// Initialize server
app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});

module.exports = app;

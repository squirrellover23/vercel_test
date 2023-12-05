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





app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});


app.get("/createTable", async (req, res) =>{
    try {
        var response = await sql`DROP TABLE IF EXISTS names22`
        res.status(200).json({ response })

    } catch (error) {
        res.status(500).send(err)

    }
 
});



app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/test.html'));
});





app.post('/updatevisit', async (req, res) => {
    const { firstName, lastName, action } = req.body;
    try {
        var row = await sql`SELECT * FROM names WHERE firstName = ${firstName} AND lastName = ${lastName};`
    } catch (error) {
        res.status(500).send('Error checking user existence.');
        return
    } 
    if (!row){
        res.status(401).send('Invalid user information.');
    } else {
        const lastLoginTime = row.lastLoginTime || 0;
        const currentTime = Date.now();

        if (currentTime - lastLoginTime >= 10 * 3600 * 1000) {
            // User can log in (it's been at least 5 minutes)
            // Update the last login time
            //AND SET visited = visited + 1
            var error = true; 
            db.run("UPDATE names SET lastLoginTime = ?, visited = visited + 1 WHERE firstName = ? AND lastName = ?", [currentTime, firstName, lastName], (err) => {
                if (err) {
                    res.status(500).send('Error updating last login time.');
                    error = false;
                } 
            });
            const currentDate = new Date().toISOString();
            const userId = `${row.firstName} ${row.lastName}`;  // Assuming the user ID is in the "names" table
            db.run("INSERT INTO login_logs (user_id, login_time) VALUES (?, ?)", [userId, currentDate], (err) => {
                if (err) {
                    res.status(500).send('Error loging visit.');
                    error = false
                } 
            });
            if (error) {
                res.status(200).json({visits: row.visited})
            }

        } else {
            res.status(429).send('You Already Logged For Today. Please try again later.');
        }
    }


    db.get("SELECT * FROM names WHERE firstName = ? AND lastName = ?", [firstName, lastName], (err, row) => {
        if (err) {
            res.status(500).send('Error checking user existence.');
        } else if (!row) {
            res.status(401).send('Invalid user information.');
        } else {
            const lastLoginTime = row.lastLoginTime || 0;
            const currentTime = Date.now();
    
            if (currentTime - lastLoginTime >= 10 * 3600 * 1000) {
                // User can log in (it's been at least 5 minutes)
                // Update the last login time
                //AND SET visited = visited + 1
                var error = true; 
                db.run("UPDATE names SET lastLoginTime = ?, visited = visited + 1 WHERE firstName = ? AND lastName = ?", [currentTime, firstName, lastName], (err) => {
                    if (err) {
                        res.status(500).send('Error updating last login time.');
                        error = false;
                    } 
                });
                const currentDate = new Date().toISOString();
                const userId = `${row.firstName} ${row.lastName}`;  // Assuming the user ID is in the "names" table
                db.run("INSERT INTO login_logs (user_id, login_time) VALUES (?, ?)", [userId, currentDate], (err) => {
                    if (err) {
                        res.status(500).send('Error loging visit.');
                        error = false
                    } 
                });
                if (error) {
                    res.status(200).json({visits: row.visited})
                }

            } else {
                res.status(429).send('You Already Logged For Today. Please try again later.');
            }
        }
      
    }); 
});

/*


app.post('/addnewuser', (req, res) => {
    const { firstName, lastName, classIn } = req.body;

    // Check if the user already exists in the database
    db.get("SELECT * FROM names WHERE firstName = ? AND lastName = ?", [firstName, lastName], (err, row) => {
        if (err) {
            res.status(500).send('Error checking user existence.');
        } else if (row) {
            // User already exists, send an error message
            //res.redirect('/error');
        } else {
            // User doesn't exist, insert into the database
            db.run("INSERT INTO names (firstName, lastName, visited, class, lastLoginTime) VALUES (?, ?, 0, ?, 0)", [firstName, lastName, classIn], (err) => {
                if (err) {
                    res.status(500).send('Error adding the new user.');
                } else {
                    res.render('useradded', { first: firstName, last: lastName });

                }
            });
        }
    });
});
*/

async function getUniqueValues(columnName, tableName, callback) {

    // SQLite query to get unique values
    try {
        const response = await sql`SELECT DISTINCT ${columnName} FROM ${tableName}`;
    } catch (error) {
        callback(err, null);
        return;
    }
    const uniqueValues = rows.map(row => row[columnName]);
    // Return the unique values
    callback(null, uniqueValues);

}

// Example usage


app.get('/adduser', (req, res) => {
    getUniqueValues('class', 'names', (err, result) => {
        if (err) {
            res.status(500).send('Error fetching class data.');
        }
        res.render('adduser', {classes: result});
    });
            
});


app.get('/viewusers', async (req, res) => {
    try {
        const rows = await sql`SELECT firstName, lastName, visited, class FROM names`;
        res.render('viewusers', { users: rows});
    } catch (error) {
        res.status(500).send('Error fetching user data.');
        return;
    }
    
    
});

/*
app.post('/updatevisits', (req, res) => {
    const { firstName, lastName, visits } = req.body;
    db.run("UPDATE names SET visited = ? WHERE firstName = ? AND lastName = ?", [visits, firstName, lastName], (err) => {
        if (err) {
            res.status(500).send('Error updating the visit count.');
        } else {
            res.redirect('/viewusers'); // Redirect back to the "View Users" page
        }
    });
});


app.post('/checkuser', (req, res) => {
    const { firstName, lastName } = req.body;
    db.get("SELECT * FROM names WHERE firstName = ? AND lastName = ?", [firstName, lastName], (err, row) => {
        if (err) {
            res.status(500).send('Error checking user existence.');
        } else if (!row) {
            res.status(401).send('Invalid user information.');
        } else {
            res.status(200).send('User exists in db')
        }
    });
});


app.post('/deleteuser', (req, res) => {
    const { firstName, lastName } = req.body;
    db.run("DELETE FROM names WHERE firstName = ? AND lastName = ?", [firstName, lastName], (err) => {
        if (err) {
            res.status(500).send('Error deleting the user.');
        } else {
            res.redirect('/viewusers'); // Redirect back to the "View Users" page
        }
    });
});

app.get('/login-attempts', (req, res) => {
    // Retrieve all login attempts from the login_logs table
    db.all('SELECT * FROM login_logs', (err, rows) => {
      if (err) {
        console.error('Error retrieving login attempts:', err.message);
        res.status(500).send('Internal Server Error');
      } else {
        // Render the login attempts page and pass the login attempts data to the view
        res.render('login-attempts', { loginAttempts: rows });
      }
    });
});
*/

// Initialize server
app.listen(port, () => {
    console.log(`Running on port ${port}.`);
});

module.exports = app;

const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");
const { v4: uuidv4 } = require('uuid');



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodoverride("_method"));
app.use(express.urlencoded({ extended: true }));



//Faker - To get random data for our website
let RandomUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'user',
  password: '@sauravanand001',
});


app.listen("8080", () => {
  console.log("App is listning to the Port 8080");
});


//Home Page
app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("SOME ERROR IN YOUR DATABASE");
  }
});


// Add user
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user", (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let id = uuidv4();
  let add = `INSERT INTO user (username, email, password,id)
  VALUES ('${username}','${email}', '${password}', '${id}')`;
  try {
    connection.query(add, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});


//User Data
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("showuser.ejs", { result });
    });
  } catch (err) {
    console.log(err);
    res.send("SOME ERROR IN YOUR DATABASE");
  }
});

// Edit user
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("SOME ERROR IN YOUR DATABASE");
  }
});


//Update Route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formpass, username: newusername } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formpass != user.password) {
        res.send("<h1>Access Denied Wrong Password:(</h1>");
      } else {
        let q2 = `UPDATE user SET username='${newusername}' WHERE id='${id}' `;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        })
      }
    });
  } catch (err) {
    console.log(err);
    res.send("SOME ERROR IN YOUR DATABASE");
  }
});

//Delete user
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("SOME ERROR IN YOUR DATABASE");
  }
});


app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formpass } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formpass != user.password) {
        res.send("<h1>Access Denied Wrong Password:(</h1>");
      } else {
        let q3 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q3, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        })
      }
    });
  } catch (err) {
    console.log(err);
    res.send("SOME ERROR IN YOUR DATABASE");
  }
});
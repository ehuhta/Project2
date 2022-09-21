const express = require("express"); // Include ExpressJS
const mysql = require("mysql");
const session = require("express-session");
const path = require("path");
const { truncate } = require("fs/promises");
const { request } = require("http");
const { response } = require("express");
const app = express(); // Create an ExpressJS app
const port = 3000; //Port we will listen to
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodelogin",
});

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/login.html"));
});

app.post("/auth", (req, res) => {
  //Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, feilds) {
        if (error) throw error;
        if (results.lenght > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          //rename /home to whatever game page is called//
          response.redirect("/home");
        } else {
          response.send("Incorrect Username and/or Password");
        }
        response.end();
      }
    );
  } else {
    response.send("Enter Username and Password");
    response.end;
  }
});

// Funsction to listen on the port
app.listen(port, () => {
  console.log(`This app is listening on port ${port}`);
});

app.get("/home", (req, res) => {
  if (request.session.loggedin) {
    response.send("Hello " + request.session.username + "!");
  } else {
    response.send("Login to play!");
  }
  response.end();
});

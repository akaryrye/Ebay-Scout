// Modules and Imports
const express = require('express');
const env = require('dotenv').config();
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const exphbs = require("express-handlebars");


// Express Config
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Handlebars Config
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Load Models
var db = require("./models");

// Passport Config
app.use(session({ 
  secret:'mysecretkey',
  resave:true,
  saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

// Load Routes
var routes = require("./controllers/routes.js")(app);
var authRoute = require("./controllers/auth.js")(app, passport);

// Load Passport Strategy
require('./config/passport.js')(passport, db.User);


// Start Server
db.sequelize.sync({}).then(function() {
  app.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
  });
});

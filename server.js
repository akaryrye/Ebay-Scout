// Modules and Imports
const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require("express-handlebars");
const db = require("./models");


// App Config
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Passport Config
app.use(session({ secret:'mysecretkey', resave:true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

// Handlebars Config
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./controllers/routes.js")(app, passport);
// Passport Config
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Email not found.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Start Server
db.sequelize.sync({}).then(function() {
  app.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
  });
});

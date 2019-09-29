const db = require("../models");
const passport = require('passport');

module.exports = function(app) {
  
  // Render index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  app.get("/register", function(req, res) {
    res.render("register");
  });

  app.get("/search", function(req, res) {
    res.render("find");
  });

  app.post("/api/register", function(req, res) {
    
    let user = {
      first: req.body["first-name"],
      last: req.body["last-name"],
      email: req.body.email,
      pass: req.body.pass,
    };
    
    db.User.create(user).then(function(data) {
      console.log("user created successfully" + data);
      res.render("login");
    });
  });

  app.post("/api/login", function(req, res) {
    
   /*  let username = req.body.email;
    let password = req.body.pass;
    console.log(username + " " + password);
    
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: false });
 */
    db.User.findOne({
      where: {email: req.body.email}
    }).then(function(result) {
      if (result.pass === req.body.pass) {
        console.log("logged in successfully");
        res.render("index");
      } else {
        console.log("incorrect password");
        res.render("login");
      }
    });

  });

};

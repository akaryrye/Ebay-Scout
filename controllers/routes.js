module.exports = function(app) {
  
  // Render index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/find", function(req, res) {
    res.render("find");
  });

};

module.exports = function(app) {
  
  // Render index page
  app.get("/", function(req, res) {
    res.render("index");
  });

};

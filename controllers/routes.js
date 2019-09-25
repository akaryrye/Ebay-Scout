var db = require("../models");

module.exports = function(app) {
  
  // Render index page
  app.get("/", function(req, res) {
    db.Model.findOne({where:{id:1}
      }).then(function(result) {
        if (result) {
          console.log(result.dataValues.row01);
          res.render("index", result.dataValues);
        } else {
          db.Model.create({
            row01: "Hello",
            row02: "World"
          }, {
            where: {id: 1}
          }).then( function(data) {
            console.log(data[0]);
            res.render("index", data.dataValues);
          });
        }
      });
  });

};
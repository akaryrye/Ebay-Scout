module.exports = function(sequelize, DataTypes) {
  var Model = sequelize.define("Model", {
    row01: DataTypes.STRING,
    row02: DataTypes.STRING
  }, {
      freezeTableName: true
  });
  
  return Model;
};

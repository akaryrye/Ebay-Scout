module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    first: DataTypes.STRING,
    last: DataTypes.STRING,
    email: DataTypes.STRING,
    pass: DataTypes.STRING
  }, {
      freezeTableName: true
  });
  
  return User;
};

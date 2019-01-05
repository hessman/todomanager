'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    rank: DataTypes.STRING,
    teamId: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Todo)
    User.belongsTo(models.Team, { foreignKey: 'teamId' });
  };
  return User;
};
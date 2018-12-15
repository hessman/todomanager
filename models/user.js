'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    rank: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.belongsToMany(models.Todo, { through: 'UserTodo', foreignKey: 'userId' });
    User.belongsToMany(models.Team, { through: 'Affiliation', foreignKey: 'userId' });
    User.belongsToMany(models.Team, { through: 'Moderation', foreignKey: 'userId' });
    User.hasOne(models.Session);
  };
  return User;
};
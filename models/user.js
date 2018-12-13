'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  users.associate = function(models) {
    users.belongsToMany(models.todos, { through: 'users_todos', foreignKey: 'userId' })
    users.belongsToMany(models.teams, { through: 'teams_todos', foreignKey: 'userId' })
    users.hasOne(models.sessions)
  };
  return users;
};
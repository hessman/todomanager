'use strict';
module.exports = (sequelize, DataTypes) => {
  const todos = sequelize.define('todos', {
    message: DataTypes.TEXT,
    completion: DataTypes.STRING
  }, {});
  todos.associate = function(models) {
    todos.belongsToMany(models.users, { through: 'users_todos', foreignKey: 'todoId' })
    todos.belongsToMany(models.teams, { through: 'teams_todos', foreignKey: 'todoId' })
  };
  return todos;
};
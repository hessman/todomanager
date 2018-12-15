'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    completion: DataTypes.STRING
  }, {});
  Todo.associate = function(models) {
    Todo.belongsToMany(models.User, { through: 'UserTodo', foreignKey: 'todoId' });
    Todo.belongsToMany(models.Team, { through: 'TeamTodo', foreignKey: 'todoId' });
  };
  return Todo;
};
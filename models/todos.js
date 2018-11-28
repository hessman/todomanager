'use strict';
module.exports = (sequelize, DataTypes) => {
  const todos = sequelize.define('todos', {
    message: DataTypes.TEXT,
    completion: DataTypes.STRING
  }, {});
  todos.associate = function(models) {
    // associations can be defined here
  };
  return todos;
};
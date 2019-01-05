'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    completion: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Todo.associate = function (models) {
    Todo.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Todo;
};
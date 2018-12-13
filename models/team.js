'use strict';
module.exports = (sequelize, DataTypes) => {
  const teams = sequelize.define('teams', {
    name: DataTypes.STRING
  }, {});
  teams.associate = function(models) {
    teams.belongsToMany(models.users, { through: 'teams_todos', foreignKey: 'teamId' })
  };
  return teams;
};
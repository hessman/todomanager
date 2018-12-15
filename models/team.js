'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: DataTypes.STRING
  }, {});
  Team.associate = function(models) {
    Team.belongsToMany(models.User, { through: 'Affiliation', foreignKey: 'teamId' });
    Team.belongsToMany(models.User, { through: 'Moderation', foreignKey: 'teamId' });
  };
  return Team;
};
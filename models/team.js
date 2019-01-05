'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: DataTypes.STRING,
    creatorId: DataTypes.INTEGER
  }, {});
  Team.associate = function(models) {
    Team.hasMany(models.User);
    Team.belongsTo(models.User, { foreignKey: 'creatorId' });
  };
  return Team;
};
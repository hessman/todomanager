'use strict';
module.exports = (sequelize, DataTypes) => {
  const sessions = sequelize.define('sessions', {
    accessToken: DataTypes.STRING,
    expiresAt: DataTypes.DATE
  }, {});
  sessions.associate = function(models) {
    sessions.belongsTo(models.users)
  };
  return sessions;
};
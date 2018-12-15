'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    accessToken: DataTypes.STRING,
    expiresAt: DataTypes.DATE
  }, {});
  Session.associate = function(models) {
    Session.belongsTo(models.User);
  };
  return Session;
};
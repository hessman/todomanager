'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    accessToken: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {});
  Session.associate = function(models) {
    Session.belongsTo(models.User);
  };
  return Session;
};
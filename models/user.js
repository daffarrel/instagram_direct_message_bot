'use strict';

// Import npm modules.
var bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    bill_token: DataTypes.STRING,
    role: DataTypes.INTEGER,
    state: DataTypes.INTEGER
  }, {});

  User.beforeSave(function(user, options) {
    if(user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });

  User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
  };

  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Role, {
      foreignKey: 'id'
    });

    User.hasMany(models.Bot, {
      foreignKey: 'user_id',
      as: 'Bots'
    });
  };
  return User;
};
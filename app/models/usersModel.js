const bcrypt = require('bcryptjs');

let User = sequelize.define('user', {
  'firstName': {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  },
  'lastName': {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  },
  'email': {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  },
  'username': {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  },
  'password': {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  },
  'tokenKey': {
    type: Sequelize.STRING,
    allowNull: true,
    notEmpty: false
  }
});

User.beforeCreate(function (user) {
  let salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
});

User.sync();

module.exports = User;
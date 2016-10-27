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
  'hashedPassword': {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  }
});

User.sync();

module.exports = User;
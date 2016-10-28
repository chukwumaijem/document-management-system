let Role = sequelize.define('role', {
  'title': {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
    unique: true
  }
});

Role.sync();

module.exports = Role;
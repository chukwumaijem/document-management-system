let Role = sequelize.define('role', {
  'title': {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  }
});

Role.sync();

module.exports = Role;
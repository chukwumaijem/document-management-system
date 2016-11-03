module.exports = function (sequelize, DataTypes) {
  const Role = sequelize.define('Role', {
    'title': {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      unique: true
    }
  });
  return Role;
}
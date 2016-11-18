const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      notEmpty: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      notEmpty: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    }
  },
    {
      classMethods: {
        associate: (models) => {
          User.belongsTo(models.Role, {
            onDelete: 'CASCADE',
            foreignKey: {
              defaultValue: 2,
              allowNull: false
            }
          });
        }
      }
    });

  User.beforeCreate((user) => {
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
  });

  return User;
};

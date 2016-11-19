/**
 * This function creates the Role model
 *
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @returns {Object} Role
 */
export default function (sequelize, DataTypes) {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      unique: true
    }
  });
  return Role;
};

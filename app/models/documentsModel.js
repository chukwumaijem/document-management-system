/**
 * This function creates the Document model
 *
 * @param {Object} sequelize
 * @param {Object} Sequelize
 * @returns {Object} Document
 */
export default function (sequelize, Sequelize) {
  const Document = sequelize.define('Document', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
      notEmpty: true
    },
    public: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
    {
      classMethods: {
        associate: (models) => {
          Document.belongsTo(models.Role, {
            onDelete: 'CASCADE',
            foreignKey: {
              allowNull: false
            }
          });
          Document.belongsTo(models.User, {
            as: 'owner',
            onDelete: 'CASCADE',
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    });
  return Document;
}

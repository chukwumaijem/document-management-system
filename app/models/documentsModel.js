module.exports = function (sequelize, Sequelize) {
  const Document = sequelize.define('Document', {
    'title': {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    'content': {
      type: Sequelize.TEXT,
      allowNull: false,
      notEmpty: true
    },
    'public': {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        Document.belongsTo(models.Role, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
        Document.belongsTo(models.User, {
          as: 'owner',
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    },
    // timestamps: true,
    // createdAt: 'publishedDate',
    // updatedAt: 'updateDate'
  });
  return Document;
}
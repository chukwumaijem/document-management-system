let Document = sequelize.define('document', {
  'title': {
    type: Sequelize.BLOB,
    allowNull: false,
    notEmpty: true
  },
  'content': {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  }
});

Document.sync();

module.exports = Document;
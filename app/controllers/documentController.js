const documents = require('../models/documentsModel');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

let docControl = {
  getDocuments: function (req, res) {
    res.send('Get all documents');
  },

  getDocument: function (req, res) {
    res.send('Get document');
  },

  searchDocument: function (req, res) {
    res.send('Search document');
  },

  createDocument: function (req, res) {
    res.send('Create document');
  },

  updateDocument: function (req, res) {
    res.send('Update document');
  },

  deleteDocument: function (req, res) {
    res.send('Delete document');
  }
}

module.exports = docControl;
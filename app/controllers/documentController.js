const Document = require('../models/documentsModel');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

let docControl = {
  getDocuments: function (req, res) {
    Document.findAll()
      .then((documents) => {
        res.json(documents);
      })
      .catch((err) => {
        handleError(res, err.message, 'Error fetching documents.');
      });
  },

  getDocument: function (req, res) {
    Document.findById(req.params.id)
      .then((document) => {
        res.json(document);
      })
      .catch((err) => {
        handleError(res, err.message, 'Error fetching document.');
      });
  },

  searchDocument: function (req, res) {
    res.send('Search document');
  },

  createDocument: function (req, res) {
    Document.create(req.body)
      .then((document) => {
        res.send({
          success: 'Document created successfully'
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Error creating document.');
      });
  },

  updateDocument: function (req, res) {
    Document.findOne({ id: req.params.id })
      .then((document) => {
        document.update(req.body);
        res.send({
          success: 'Document successfully updated.'
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Error updating document.');
      });
  },

  deleteDocument: function (req, res) {
    Document.destroy({ where: { id: req.params.id } })
      .then(() => {
        res.send({
          success: 'Document deleted.'
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Error fetching document.');
      });
  }
}

module.exports = docControl;
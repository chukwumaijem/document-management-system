const models = require('../models/dbconnect'),
  jwt = require('jsonwebtoken');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

let docControl = {
  getDocuments: function (req, res) {
    models.Document.findAll({ include: [{ model: models.Role }, { model: models.User, as: 'owner' }] })
      .then((documents) => {
        if (req.decoded && req.decoded.RoleId === 1) {
          res.json(documents);
          return;
        }
        res.send(
          documents.filter((docs) => {
            let match = false;
            if (docs.public) {
              match = true;
            } else if (req.decoded && req.decoded.id === docs.ownerId) {
              match = true;
            }
            return match ? docs : '';
          })
        );
      })
      .catch((err) => {
        handleError(res, err.message, 'Error fetching documents.');
      });
  },

  getDocument: function (req, res) {
    models.Document.findById(req.params.id, {
        include: [{ model: models.Role }, { model: models.User, as: 'owner' }]
      })
      .then((document) => {
        if (req.decoded && req.decoded.RoleId === 1) {
          res.json(document);
        } else if (document.public) {
          res.json(document);
        } else if (req.decoded && document.ownerId === req.decoded.id) {
          res.json(document);
        } else {
          res.send({ error: 'You do not have permission to view this document' });
        }
      })
      .catch((err) => {
        handleError(res, err.message, 'Error fetching document.');
      });
  },

  searchDocument: function (req, res) {
    const token = userDetail(getToken(req));
    res.send('Search document');
  },

  createDocument: function (req, res) {
    const token = userDetail(getToken(req));
    if (!token) {
      res.send({ error: 'Only registered users can create documents.' });
      return;
    }
    req.ownerId = token.id;
    models.Document.create(req.body)
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
    const token = userDetail(getToken(req));
    models.Document.update(req.body, {
        where: {
          id: req.params.id
        }
      })
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
    const token = userDetail(getToken(req));
    models.Document.destroy({ where: { id: req.params.id } })
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
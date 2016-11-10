'use strict';

const models = require('../models/dbconnect');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
}

function filterDocs(req, documents) {
  if (!Array.isArray(documents)) {
    documents = [documents];
  }
  return documents.filter((docs) => {
    let match = false;
    if (docs.public) {
      match = true;
    } else if (req.decoded && (req.decoded.id === 1 ||
      req.decoded.id === docs.ownerId)) {
      match = true;
    }
    return match ? docs : '';
  })
}

function dateFilter(date, documents) {
  return documents.filter((document) => {
    return (date === JSON.stringify(document.createdAt).substr(1, 10)) ? document : '';
  });
}

function roleFilter(role, documents) {
  return documents.filter((document) => {
    return (role.toLowerCase() === document.Role.title.toLowerCase()) ?
      document : '';
  });
}

function filterSearch(query, documents) {
  if (query.date) {
    documents = dateFilter(query.date, documents);
  }
  if (query.role) {
    documents = roleFilter(query.role, documents);
  }
  if (query.limit && documents.length > query.limit) {
    documents.length = query.limit;
  }

  return documents;
}

let docControl = {
  getDocuments: function (req, res) {
    models.Document.findAll({
      include: [{ model: models.Role },
      { model: models.User, as: 'owner' }
      ],
      order: '"createdAt" DESC'
    }).then((documents) => {
      res.send(filterDocs(req, documents));
    }).catch((err) => {
      handleError(res, err.message, 'Error fetching documents.');
    });
  },

  searchDocument: function (req, res) {
    models.Document.findAll({
      include: [{ model: models.Role },
      { model: models.User, as: 'owner' }
      ],
      order: '"createdAt" DESC',
      offset: req.query.start || 0
    }).then((documents) => {
      const result = filterSearch(req.query, filterDocs(req, documents));
      if (documents && documents.length > 1 && result.length < 1) {
        res.status(404)
          .send({ error: 'No document matched the specified query.' });
        return;
      } else if (!documents) {
        res.status(404)
          .send({ error: 'No documents found.' });
        return;
      }
      res.send(result);
    }).catch((err) => {
      handleError(res, err.message, 'Error fetching documents.');
    });
  },

  getDocument: function (req, res) {
    if (Object.keys(req.query).length) {
      return docControl.searchDocument(req, res);
    }
    models.Document.findById(req.params.id, {
      include: [{ model: models.Role }, { model: models.User, as: 'owner' }]
    }).then((document) => {
      if (!document) {
        res.send({ error: 'Document not found.' });
        return
      }
      const result = filterDocs(req, document);
      if (!result.length) {
        res.status(401)
          .send({ error: 'You do not have permission to view this document.' });
        return;
      } else {
        res.send(result);
      }
    }).catch((err) => {
      handleError(res, err.message, 'Error fetching document.');
    });
  },

  createDocument: function (req, res) {
    if (!req.decoded) {
      res.send({ error: 'Only registered users can create documents.' });
      return;
    }
    req.ownerId = req.decoded.id;
    models.Document.create(req.body).then((document) => {
      res.status(201)
        .send(document);
    }).catch((err) => {
      handleError(res, err.message, 'Error creating document.');
    });
  },

  updateDocument: function (req, res) {
    if (!req.decoded) {
      res.send({ error: "You are not logged in." });
      return;
    }
    models.Document.findOne({
      where: { id: req.params.id }
    }).then((document) => {
      if (document.ownerId === req.decoded.id || req.decoded.RoleId === 1) {
        document.update(req.body);
        res.status(200).send({
          success: 'Document successfully updated.'
        });
      } else {
        res.status(401)
          .send({ error: "You do not have permission to update this document." });
      }
    }).catch((err) => {
      handleError(res, err.message, 'Error updating document.');
    });
  },

  deleteDocument: function (req, res) {
    if (!req.decoded) {
      res.send({ error: "You are not logged in." });
      return;
    }
    models.Document.findOne({
      where: { id: req.params.id }
    }).then((document) => {
      if (document.ownerId === req.decoded.id || req.decoded.RoleId === 1) {
        document.destroy();
        res.status(200).send({
          success: 'Document deleted.'
        });
      } else {
        res.status(401)
          .send({ error: "You do not have permission to delete this document." });
      }
    }).catch((err) => {
      handleError(res, err.message, 'Error deleting document.');
    });
  }
}

module.exports = docControl;
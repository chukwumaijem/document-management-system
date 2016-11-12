'use strict';

const models = require('../models/dbconnect');

function handleError(res, reason, message, code) {
  console.log('error:' + reason);
  res.status(code || 500).json({ 'error': message });
}

function filterDocs(req, documents) {
  if (!Array.isArray(documents)) {
    documents = [documents];
  }
  return documents.filter((document) => {
    const isPublic = document.public;
    const isAdmin = req.decoded && req.decoded.id === 1;
    const isOwner = req.decoded && req.decoded.id === document.ownerId;

    return isPublic || isAdmin || isOwner;
  });
}

function dateFilter(date, documents) {
  return documents.filter((document) => {
    return date === JSON.stringify(document.createdAt).substr(1, 10);
  });
}

function roleFilter(role, documents) {
  return documents.filter((document) => {
    return role.toLowerCase() === document.Role.title.toLowerCase();
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

function searchDocument(req, res) {
  models.Document.findAll({
    include: [{ model: models.Role },
    { model: models.User, as: 'owner' }
    ],
    order: '"createdAt" DESC',
    offset: req.query.start || 0
  }).then((documents) => {
    res.send(filterSearch(req.query, filterDocs(req, documents)));
  }).catch((err) => {
    handleError(res, err.message, 'Error fetching documents.');
  });
}

class docControl {
  getDocuments(req, res) {
    models.Document.findAll({
      include: [{ model: models.Role },
      { model: models.User, as: 'owner' }
      ],
      order: '"createdAt" DESC'
      // order: [['createdAt', 'DESC'], ['title', 'DESC']]
    }).then((documents) => {
      res.send(filterDocs(req, documents));
    }).catch((err) => {
      handleError(res, err.message, 'Error fetching documents.');
    });
  }

  getDocument(req, res) {
    if (Object.keys(req.query).length) {
      return searchDocument(req, res);
    }
    models.Document.findById(req.params.id, {
      include: [{ model: models.Role }, { model: models.User, as: 'owner' }]
    }).then((document) => {
      if (!document) {
        return res.status(404)
          .send({ error: 'Document not found.' });
      }
      const result = filterDocs(req, document);
      if (!result.length) {
        res.status(401)
          .send({ error: 'You do not have permission to view this document.' });
      } else {
        res.send(result);
      }
    }).catch((err) => {
      handleError(res, err.message, 'Error fetching document.');
    });
  }

  createDocument(req, res) {
    req.ownerId = req.decoded.id;
    models.Document.create(req.body).then((document) => {
      res.status(201)
        .send(document);
    }).catch((err) => {
      handleError(res, err.message, 'Error creating document.');
    });
  }

  updateDocument(req, res) {
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
  }

  deleteDocument(req, res) {
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

module.exports = new docControl();
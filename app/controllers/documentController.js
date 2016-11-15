'use strict';

const models = require('../models/dbconnect'),
  helpers = require('./helperMethods'),
  helperMethods = new helpers(models);

class DocControl {
  getDocuments(req, res, next) {
    models.Document.findAll({
      include: [
        { model: models.Role },
        { model: models.User, as: 'owner' }
      ],
      order:[['createdAt', 'DESC']]
    }).then((documents) => {
      res.send(helperMethods.filterDocs(req, documents));
    }).catch((err) => {
      err.reason = 'Error fetching documents.';
      next(err);
    });
  }

  getDocument(req, res, next) {
    if (Object.keys(req.query).length) {
      return helperMethods.searchDocument(req, res, next);
    }
    models.Document.findById(req.params.id, {
      include: [{ model: models.Role }, { model: models.User, as: 'owner' }]
    }).then((document) => {
      if (!document) {
        return res.status(404)
          .send({ error: 'Document not found.' });
      }
      const result = helperMethods.filterDocs(req, document);
      if (!result.length) {
        res.status(401)
          .send({ error: 'You do not have permission to view this document.' });
      } else {
        res.send(result);
      }
    }).catch((err) => {
      err.reason = 'Error fetching documents.';
      next(err);
    });
  }

  createDocument(req, res, next) {
    req.ownerId = req.decoded.id;
    models.Document.create(req.body).then((document) => {
      res.status(201)
        .send(document);
    }).catch((err) => {
      err.reason = 'Error creating documents.';
      next(err);
    });
  }

  updateDocument(req, res, next) {
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
      err.reason = 'Error updating documents.';
      next(err);
    });
  }

  deleteDocument(req, res, next) {
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
      err.reason = 'Error deleting documents.';
      next(err);
    });
  }
}

module.exports = new DocControl();
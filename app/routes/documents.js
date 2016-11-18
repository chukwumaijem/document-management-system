const express = require('express');
const DocController = require('../controllers/documentController');
const authenticate = require('../middleware/auth');
const userAccess = require('../middleware/userAccess');

const documentsRoute = express.Router();
const docControl = new DocController();

/**
  * Route for creating document.
  */
documentsRoute.post('/', authenticate, (req, res, next) => {
  docControl.createDocument(req, res, next);
});

/**
  * Route for getting all documents.
  */
documentsRoute.get('/', userAccess, (req, res, next) => {
  docControl.getDocuments(req, res, next);
});

/**
  * Route for getting specified document.
  */
documentsRoute.get('/:id', userAccess, (req, res, next) => {
  docControl.getDocument(req, res, next);
});

/**
  * Route for updating a document.
  */
documentsRoute.put('/:id', authenticate, (req, res, next) => {
  docControl.updateDocument(req, res, next);
});

/**
  * Route for deleting a document.
  */
documentsRoute.delete('/:id', authenticate, (req, res, next) => {
  docControl.deleteDocument(req, res, next);
});

module.exports = documentsRoute;

'use strict';

const express = require('express'),
  documentRoutes = express.Router(),
  docControl = require('../controllers/documentController'),
  authenticate = require('../middleware/auth'),
  userAccess = require('../middleware/userAccess');

// Creates a new document instance.
documentRoutes.post('/', authenticate, docControl.createDocument);

// Find matching instances of document.
documentRoutes.get('/', userAccess, docControl.getDocuments);

// Find document.
documentRoutes.get('/:id', userAccess, docControl.getDocument);

// Update document attributes.
documentRoutes.put('/:id', authenticate, docControl.updateDocument);

// Delete document.
documentRoutes.delete('/:id', authenticate, docControl.deleteDocument);

module.exports = documentRoutes;
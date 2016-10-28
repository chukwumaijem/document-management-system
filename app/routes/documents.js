const express = require('express'),
  documentRoutes = express.Router(),
  docControl = require('../controllers/documentController'),
  authenticate = require('../middleware/auth');

// Creates a new document instance.
documentRoutes.post('/', authenticate, docControl.createDocument);

// Find matching instances of document.
documentRoutes.get('/', authenticate, docControl.getDocuments);

// Find document.
documentRoutes.get('/:id', authenticate, docControl.getDocument);

// search through documents
documentRoutes.get('/query', authenticate, docControl.searchDocument);

// Update document attributes.
documentRoutes.put('/:id', authenticate, docControl.updateDocument);

// Delete document.
documentRoutes.delete('/:id', authenticate, docControl.deleteDocument);

module.exports = documentRoutes;
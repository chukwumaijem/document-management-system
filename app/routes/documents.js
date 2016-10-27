const express = require('express'),
  documentRoutes = express.Router(),
  docControl = require('../controllers/documentController');

// Creates a new document instance.
documentRoutes.post('/', docControl.createDocument);

// Find matching instances of document.
documentRoutes.get('/', docControl.getDocuments);

// Find document.
documentRoutes.get('/:id', docControl.getDocument);

// search through documents
documentRoutes.get('/query', docControl.searchDocument);

// Update document attributes.
documentRoutes.put('/:id', docControl.updateDocument);

// Delete document.
documentRoutes.delete('/:id', docControl.deleteDocument);

module.exports = documentRoutes;
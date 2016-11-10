'use strict';

const express = require('express'),
  userRoutes = express.Router(),
  userControl = require('../controllers/userController'),
  adminAuth = require('../middleware/adminAuth'),
  authenticate = require('../middleware/auth'),
  userAccess = require('../middleware/userAccess');

// Logs a user in.
userRoutes.post('/login', userControl.loginUser);

// Creates a new user.
userRoutes.post('/', userControl.createUser);

// Find users.
userRoutes.get('/', adminAuth, userControl.getUsers);

// Find a user.
userRoutes.get('/:id', authenticate, userControl.getUser);

// Find all documents belonging to the user
userRoutes.get('/:id/documents', userAccess, userControl.getDocuments);

// Update user attributes.
userRoutes.put('/:id', authenticate, userControl.updateUser);

// Delete user.
userRoutes.delete('/:id', authenticate, userControl.deleteUser);

module.exports = userRoutes;
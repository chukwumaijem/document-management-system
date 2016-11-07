'use strict';

const express = require('express'),
  userRoutes = express.Router(),
  userControl = require('../controllers/userController'),
  authenticate = require('../middleware/auth'),
  userAccess = require('../middleware/userAccess');

// Logs a user in.
userRoutes.post('/login', userControl.loginUser);

// Logs a user out.
userRoutes.post('/logout', authenticate, userControl.logoutUser);

// Creates a new user.
userRoutes.post('/', userControl.createUser);

// Find users.
userRoutes.get('/', authenticate, userAccess, userControl.getUsers);

// Find a user.
userRoutes.get('/:id', authenticate, userAccess, userControl.getUser);

// Find all documents belonging to the user
userRoutes.get('/:id/documents', userAccess, userControl.getDocuments);

// Update user attributes.
userRoutes.put('/:id', authenticate, userAccess, userControl.updateUser);

// Delete user.
userRoutes.delete('/:id', authenticate, userAccess, userControl.deleteUser);

module.exports = userRoutes;
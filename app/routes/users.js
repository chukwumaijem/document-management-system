const express = require('express'),
  userRoutes = express.Router(),
  userControl = require('../controllers/userController'),
  authenticate = require('../middleware/auth');

// Logs a user in.
userRoutes.post('/login', userControl.loginUser);

// Logs a user out.
userRoutes.post('/logout', authenticate, userControl.logoutUser);

// Creates a new user.
userRoutes.post('/', userControl.createUser);

// Find users.
userRoutes.get('/', authenticate, userControl.getUsers);

// Find a user.
userRoutes.get('/:id', authenticate, userControl.getUser);

// Find all documents belonging to the user
userRoutes.get('/:id/documents', authenticate, userControl.getDocuments);

// Update user attributes.
userRoutes.put('/:id', authenticate, userControl.updateUser);

// Delete user.
userRoutes.delete('/:id', authenticate, userControl.deleteUser);

module.exports = userRoutes;
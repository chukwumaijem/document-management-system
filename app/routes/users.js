const express = require('express'),
  userRoutes = express.Router(),
  userControl = require('../controllers/userController');

// Logs a user in.
userRoutes.post('/login', userControl.loginUser);

// Logs a user out.
userRoutes.post('/logout', userControl.logoutUser);

// Creates a new user.
userRoutes.post('/', userControl.createUser);

// Find users.
userRoutes.get('/', userControl.getUsers);

// Find a user.
userRoutes.get('/:id', userControl.getUser);

// Find all documents belonging to the user
userRoutes.get('/:id/documents', userControl.getDocuments);

// Update user attributes.
userRoutes.put('/:id', userControl.updateUser);

// Delete user.
userRoutes.delete('/:id', userControl.deleteUser);

module.exports = userRoutes;
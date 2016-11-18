const express = require('express');
const UserController = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');
const authenticate = require('../middleware/auth');
const userAccess = require('../middleware/userAccess');

const userRoutes = express.Router();
const userControl = new UserController();


/**
  * Route for user login.
  */
userRoutes.post('/login', (req, res, next) => {
  userControl.loginUser(req, res, next);
});

/**
  * Route for user sign up.
  */
userRoutes.post('/', (req, res, next) => {
  userControl.createUser(req, res, next);
});

/**
  * Route for getting all users data.
  */
userRoutes.get('/', adminAuth, (req, res, next) => {
  userControl.getUsers(req, res, next);
});

/**
  * Route for getting a particular user.
  */
userRoutes.get('/:id', authenticate, (req, res, next) => {
  userControl.getUser(req, res, next);
});

/**
  * Route for getting a users documents.
  */
userRoutes.get('/:id/documents', userAccess, (req, res, next) => {
  userControl.getDocuments(req, res, next);
});

/**
  * Route for updating user's data.
  */
userRoutes.put('/:id', authenticate, (req, res, next) => {
  userControl.updateUser(req, res, next);
});

/**
  * Route for deleting a user.
  */
userRoutes.delete('/:id', authenticate, (req, res, next) => {
  userControl.deleteUser(req, res, next);
});

module.exports = userRoutes;

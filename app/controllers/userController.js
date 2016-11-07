'use strict';

const models = require('../models/dbconnect'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

function createToken(userdata) {
  const token = jwt.sign(userdata, process.env.secret, { expiresIn: 60 });
  return token;
};

let userControl = {

  // login user control
  loginUser: function (req, res) {
    if (!req.body.username) {
      res.status(400)
        .send({ error: 'Username is required.' });
      return;
    }
    if (!req.body.password) {
      res.status(400)
        .send({ error: 'Password is required.' });
      return;
    }
    models.User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = createToken({ id: user.id, username: user.username, RoleId: user.RoleId });
          res.status(200)
            .send({
              success: 'Login successful.',
              token
            });
        }
      }).catch((err) => {
        handleError(res, err.message, 'Login failed. Username or password invalid.', 404);
      });
  },

  // log out user control Should be fixed
  logoutUser: function (req, res) {
    models.User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        res.send({ success: "User successfully logged out." })
      })
      .catch((err) => {
        handleError(res, err.message, 'Logout failed.');
      });
  },

  // get user control
  getUser: function (req, res) {
    models.User.findOne({
        where: {
          id: req.params.id
        },
        include: [{
          model: models.Role
        }]
      })
      .then((user) => {
        res.json(user)
      })
      .catch((err) => {
        handleError(res, err.message, 'Error getting user');
      });
  },

  // get users
  getUsers: function (req, res) {
    models.User.findAll({
        include: [{
          model: models.Role
        }]
      })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        handleError(res, err, 'Error getting users');
      });
  },

  getDocuments: function (req, res) {
    models.Document.findAll({
        where: { ownerId: req.params.id },
        include: [{ model: models.Role }, { model: models.User, as: 'owner' }]
      })
      .then((document) => {
        let result = document.filter((doc) => {
          if (doc.public) {
            return doc;
          } else if ((req.decoded && req.decoded.id === doc.ownerId) ||
            req.decoded.RoleId === 1) {
            return doc;
          }
        });
        if (document.length < 1) {
          handleError(res, 'User have no documents.',
            'No documents found for this user.');
        } else if (result.length < 1) {
          handleError(res, 'User have no public documents.',
            'User have no public documents.');
        } else {
          res.send(result);
        }
      })
      .catch((err) => {
        handleError(res, err.message, 'Error getting user documents');
      });
  },

  // create new user control
  createUser: function (req, res) {
    if (!req.body.username || !req.body.firstName ||
      !req.body.lastName || !req.body.email || !req.body.password) {
      res.send({
        Error: 'User data incomplete.'
      });
      return;
    };

    models.User.create(req.body)
      .then((newUser) => {
        let token = createToken({
          id: newUser.id,
          username: newUser.username,
          RoleId: newUser.RoleId
        });
        newUser.token = token;
        newUser.success = 'User created.';
        res.status(201).json(newUser);
      }).catch((err) => {
        handleError(res, err.message, 'User already exist.', 409);
      });
  },

  // 
  updateUser: function (req, res) {
    if (!req.decoded) {
      res.send({ error: "You are not logged in." });
      return;
    }
    if (req.body.RoleId && req.decoded.RoleId !== 1) {
      res.send({ error: "Only an admin can add admins." });
      return;
    }
    models.User.findOne({
        where: { id: req.params.id }
      })
      .then((user) => {
        if (user.id === req.decoded.id || req.decoded.RoleId === 1) {
          user.update(req.body);
          res.send({
            success: "User data updated.",
            user
          });
          return;
        } else {
          res.send({ error: "You do not permission to update user data." });
        }
      })
      .catch((err) => {
        handleError(res, err.message, 'Update failed');
      });
  },

  deleteUser: function (req, res) {
    if (!req.decoded) {
      res.send({ error: "You are not logged in." });
      return;
    }
    if (req.body.RoleId && req.decoded.RoleId !== 1) {
      res.send({ error: "Only an admin can add admins." });
      return;
    }
    models.User.findOne({
        where: { id: req.params.id }
      })
      .then((user) => {
        if (user.id === req.decoded.id || req.decoded.RoleId === 1) {
          user.destroy();
          res.send({
            success: "User data deleted.",
            username: user.username
          });
          return;
        } else {
          res.send({ error: "You do not have permission to delete user." });
        }
      })
      .catch((err) => {
        handleError(res, err.message, 'Cannot delete data.');
      });
  }
}

module.exports = userControl;
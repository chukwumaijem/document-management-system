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
        } else {
          res.status(400)
            .send({
              error: 'Login failed. Username or password invalid.'
            });
        }
      }).catch((err) => {
        handleError(res, err.message, 'Login failed.', 404);
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
    }).then((document) => {
      let result = document.filter((doc) => {
        let isPublic = doc.public,
          isOwner = req.decoded && req.decoded.id === doc.ownerId,
          isAdmin = req.decoded && req.decoded.RoleId === 1;

        return isPublic || isOwner || isAdmin;
      });
      if (document.length < 1) {
        handleError(res, 'User have no documents.',
          'No documents found for this user.', 404);
      } else if (result.length < 1) {
        handleError(res, 'User have no public documents.',
          'User have no public documents.', 404);
      } else {
        res.status(200).send(result);
      }
    }).catch((err) => {
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
    }

    models.User.create(req.body)
      .then((user) => {
        let token = createToken({
          id: user.id,
          username: user.username,
          RoleId: user.RoleId
        });
        res.status(201)
          .send({
            user,
            token,
            success: 'User created.'
          });
      }).catch((err) => {
        handleError(res, err.message, 'User already exist.', 409);
      });
  },

  // update user data
  updateUser: function (req, res) {
    if (req.body.RoleId && req.decoded.RoleId !== 1) {
      res.status(401).send({ error: "Only an admin can add admins." });
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
          res.status(401)
            .send({ error: "You do not have permission to update user data." });
        }
      })
      .catch((err) => {
        handleError(res, err.message, 'Update failed');
      });
  },

  deleteUser: function (req, res) {
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
          res.status(401).send({ error: "You do not have permission to delete user." });
        }
      })
      .catch((err) => {
        handleError(res, err.message, 'Cannot delete data.');
      });
  }
}

module.exports = userControl;
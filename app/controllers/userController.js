const models = require('../models/dbconnect'),
  jwt = require('jsonwebtoken');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

function createToken(userdata) {
  let token = jwt.sign(userdata, process.env.secret, { expiresIn: 21600 });
  return token;
};

function getToken(req) {
  return req.body.token || req.query.token || req.headers['x-access-token'];
}

function userDetail(token) {
  return jwt.decode(token, process.env.secret, function (err, decoded) {
    if (err) throw err;
    return decoded;
  });
}

let userControl = {

  // login user control
  loginUser: function (req, res) {
    if (!req.body.username) {
      res.send({ Error: 'Username is required.' });
      return;
    }
    if (!req.body.password) {
      res.send({ Error: 'Password is required.' });
      return;
    }
    models.User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        if (user.password = req.body.password) {
          let token = createToken({ id: user.id, username: user.username, RoleId: user.RoleId });
          res.send({
            message: 'Login successful.',
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
        id: req.params.id,
        include: [{
          model: models.Role
        }],
        // attributes: ['id', 'firstName', 'lastName', 'username', ]
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
        handleError(res, err.message, 'Error getting users');
      });
  },

  getDocuments: function (req, res) {
    const token = userDetail(getToken(req));
    models.Document.findAll({
        where: { ownerId: req.params.id },
        include: [{ model: models.Role }, { model: models.User, as: 'owner' }]
      })
      .then((document) => {
        result = document.filter((doc) => {
          if (doc.public) {
            console.log('public');
            return doc;
          } else if (token && token.id === doc.ownerId) {
            console.log('not public');
            return doc;
          }
        });
        if (document.length < 1) {
          handleError(res, 'User have no documents.', 'User have no documents or User does not exist.');
        } else if (result.length < 1) {
          handleError(res, 'User have no public documents.', 'User have no public documents.');
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
    if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
      res.send({
        Error: 'User data incomplete.'
      });
      return;
    };

    models.User.create(req.body)
      .then((newUser) => {
        let token = createToken({ id: newUser.id, username: newUser.username, RoleId: user.RoleId });
        res.send({
          success: 'User created.',
          username: newUser.username,
          token
        });
      }).catch((err) => {
        handleError(res, err.message, 'User already exist.');
      });
  },

  // 
  updateUser: function (req, res) {
    models.User.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      .then((user) => {
        res.send({
          success: "User data updated.",
          user
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Update failed');
      });
  },

  deleteUser: function (req, res) {
    models.User.destroy({ where: { id: req.params.id } })
      .then((user) => {
        res.send({
          success: "User data deleted.",
          username: user.username
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Cannot delete data.');
      });
  }
}

module.exports = userControl;
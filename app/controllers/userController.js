const User = require('../models/usersModel'),
  jwt = require('jsonwebtoken');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

function createToken(userdata) {
  let token = jwt.sign(userdata, process.env.secret, { expiresIn: 21000 });
  return token;
};

// function genTokenKey() {
//   let text = "";
//   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//   for (var i = 0; i < 5; i++)
//     return text += possible.charAt(Math.floor(Math.random() * possible.length));
// }

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
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (user.password = req.body.password) {
          user.update({ tokenKey });
          res.send({
            message: 'Login successful.',
            token: createToken({ username: user.username })
          });
        }
      }).catch((err) => {
        handleError(res, err.message, 'Login failed. Username or password invalid.', 404);
      });
  },

  // log out user control Should be fixed
  logoutUser: function (req, res) {
    User.findOne({ username: req.body.username })
      .then((user) => {
        user.update({ tokenKey: 'null' })
        res.send({ success: "User successfully logged out." })
      })
      .catch((err) => {
        handleError(res, err.message, 'Logout failed.');
      });
  },

  // get user control
  getUser: function (req, res) {
    User.findOne({ id: req.params.id, attributes: ['id', 'firstName', 'lastName', 'username'] })
      .then((user) => {
        res.json(user)
      })
      .catch((err) => {
        handleError(res, err.message, 'Error getting user');
      });
  },

  // get users
  getUsers: function (req, res) {
    User.findAll({ attributes: ['id', 'firstName', 'lastName', 'username'] })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        handleError(res, err.message, 'Error getting users');
      });
  },

  getDocuments: function (req, res) {
    res.send('Get user documents');
  },

  // create new user control
  createUser: function (req, res) {
    if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
      res.send({
        Error: 'User data incomplete.'
      });
      return;
    };

    User.create(req.body)
      .then((newUser) => {
        let token = createToken({ username: newUser.username });
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
    User.findOne({ id: req.params.id })
      .then((user) => {
        user.update(req.body);
        res.send({
          success: "User data updated."
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Update failed');
      });
  },

  deleteUser: function (req, res) {
    User.destroy({ where: { id: req.params.id } })
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
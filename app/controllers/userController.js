const users = require('../models/usersModel');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

let userControl = {
  loginUser: function (req, res) {
    res.send('login');
  },

  logoutUser: function (req, res) {
    res.send('logout');
  },

  getUser: function (req, res) {
    res.send('getUser');
  },

  getUsers: function (req, res) {
    res.send('getusers');
  },

  getDocuments: function (req, res) {
    res.send('Get user documents');
  },

  createUser: function (req, res) {
    res.send('createUser');
  },

  updateUser: function (req, res) {
    res.send('updateUser');
  },

  deleteUser: function (req, res) {
    res.send('deleteUser');
  }
}

module.exports = userControl;
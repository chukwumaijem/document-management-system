const roles = require('../models/rolesModel'),
  express = require('express'),
  roleRoutes = express.Router();

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

roleRoutes.post('/:role', (req, res) => {
  res.send('Create new role');
});

roleRoutes.get('/', (req, res) => {
  res.send('Get all roles');
});

roleRoutes.put('/:role', (req, res) => {
  res.send('Update role');
});

roleRoutes.delete('/:role', (req, res) => {
  res.send('Delete role');
});

module.exports = roleRoutes;
const express = require('express'),
  roleControl = require('../controllers/roleController'),
  roleRoutes = express.Router(),
  authenticate = require('../middleware/auth');

roleRoutes.post('/', authenticate, roleControl.createRole);

roleRoutes.get('/', authenticate, roleControl.getRoles);

roleRoutes.put('/:id', authenticate, roleControl.updateRole);

roleRoutes.delete('/:id', authenticate, roleControl.deleteRole);

module.exports = roleRoutes;
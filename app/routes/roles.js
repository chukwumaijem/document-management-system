'use strict';

const express = require('express'),
  roleControl = require('../controllers/roleController'),
  roleRoutes = express.Router(),
  adminAuth = require('../middleware/adminAuth');

roleRoutes.post('/', adminAuth, roleControl.createRole);

roleRoutes.get('/', adminAuth, roleControl.getRoles);

roleRoutes.put('/:id', adminAuth, roleControl.updateRole);

roleRoutes.delete('/:id', adminAuth, roleControl.deleteRole);

module.exports = roleRoutes;
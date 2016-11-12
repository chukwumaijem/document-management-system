'use strict';

const express = require('express'),
  roleControl = require('../controllers/roleController'),
  roleRoutes = express.Router();

roleRoutes.post('/', roleControl.createRole);

roleRoutes.get('/', roleControl.getRoles);

roleRoutes.put('/:id', roleControl.updateRole);

roleRoutes.delete('/:id', roleControl.deleteRole);

module.exports = roleRoutes;
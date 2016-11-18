const express = require('express');
const roleControl = require('../controllers/roleController');

const roleRoutes = express.Router();

/**
  * Route for creating roles.
  */
roleRoutes.post('/', roleControl.createRole);

/**
  * Route for getting roles.
  */
roleRoutes.get('/', roleControl.getRoles);

/**
  * Route for updating roles.
  */
roleRoutes.put('/:id', roleControl.updateRole);

/**
  * Route for deleting roles.
  */
roleRoutes.delete('/:id', roleControl.deleteRole);

module.exports = roleRoutes;

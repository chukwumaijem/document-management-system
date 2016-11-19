import express from 'express';
import RoleController from '../controllers/roleController';

const roleControl = new RoleController();
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

export default roleRoutes;

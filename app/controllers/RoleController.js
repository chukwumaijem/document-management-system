import models from '../models/dbconnect';

  /**
   * This class handles roles route
   */
export default class RoleController {

  /**
   * This method creates a new role
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  createRole(req, res, next) {
    models.Role.create(req.body).then((role) => {
      res.status(201)
        .send({
          success: 'New role created successfully.'
        });
    }).catch((err) => {
      err.reason = 'Role already exists.';
      err.code = 409;
      next(err);
    });
  }

  /**
   * This method fetches all the roles
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  getRoles(req, res, next) {
    models.Role.findAll().then((role) => {
      res.json(role);
    }).catch((err) => {
      err.reason = 'Error fetching role.';
      next(err);
    });
  }

  /**
   * This method update role
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  updateRole(req, res, next) {
    models.Role.findOne({
      where: {
        id: req.params.id
      }
    }).then((role) => {
      if (!role) {
        res.status(404)
          .send({ error: 'Role does not exist.' });
        return;
      }
      role.update(req.body);
      res.status(200)
        .send({
          success: 'Role updated successfully.',
          title: role.title
        });
    }).catch((err) => {
      err.reason = 'Role cannot be updated.';
      next(err);
    });
  }

  /**
   * This method deletes role
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  deleteRole(req, res, next) {
    models.Role.findOne({
      where: { id: req.params.id }
    }).then((role) => {
      if (!role) {
        res.status(404)
          .send({ error: 'Role does not exist.' });
        return;
      }
      role.destroy();
      res.send({
        success: 'Role was deleted successfully.'
      });
    }).catch((err) => {
      err.reason = 'Role cannot be deleted.';
      next(err);
    });
  }
}

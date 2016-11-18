const models = require('../models/dbconnect');


  /**
    * This class handles roles route
    */
class RoleControl {

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
      const error = err;
      error.reason = 'Role already exists.';
      error.code = 409;
      next(error);
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
      const error = err;
      error.reason = 'Error fetching role.';
      next(error);
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
      const error = err;
      error.reason = 'Role cannot be updated.';
      next(error);
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
      const error = err;
      error.reason = 'Role cannot be deleted.';
      next(error);
    });
  }

}

module.exports = new RoleControl();

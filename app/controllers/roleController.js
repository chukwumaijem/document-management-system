'use strict';

const models = require('../models/dbconnect');

function handleError(res, reason, message, code) {
  console.log('error:' + reason);
  res.status(code || 500).json({ 'error': message });
}

module.exports = {

  createRole(req, res) {
    models.Role.create(req.body).then((role) => {
      res.status(201)
        .send({
          success: "New role created successfully."
        });
    }).catch((err) => {
      handleError(res, err.message, 'Role already exists.', 409);
    });
  },

  getRoles(req, res) {
    models.Role.findAll().then((role) => {
      res.json(role);
    }).catch((err) => {
      handleError(res, err.message, 'Error fetching role.');
    });
  },

  updateRole(req, res) {
    models.Role.findOne({
      where: {
        id: req.params.id
      }
    }).then((role) => {
      if (!role) {
        res.status(400)
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
      handleError(res, err.message, 'Role cannot be updated.');
    });
  },

  deleteRole(req, res) {
    models.Role.findOne({
      where: { id: req.params.id }
    }).then((role) => {
      if (!role) {
        res.status(400)
          .send({ error: 'Role does not exist.' });
        return;
      }
      role.destroy();
      res.send({
        success: 'Role was deleted successfully.'
      });
    }).catch((err) => {
      handleError(res, err.message, 'Role cannot be deleted.');
    });
  }

}

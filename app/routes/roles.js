const Role = require('../models/rolesModel'),
  express = require('express'),
  roleRoutes = express.Router(),
  authenticate = require('../middleware/auth');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

roleRoutes.post('/', authenticate, (req, res) => {
  Role.create(req.body)
    .then((role) => {
      res.send({
          success: "Role created"
        })
        .catch((er) => {
          handleError(res, err.message, 'Role cannot be created.');
        });
    });
});

roleRoutes.get('/', authenticate, (req, res) => {
  Role.findAll({})
    .then((role) => {
      res.json(role);
    })
    .catch((err) => {
      handleError(res, err.message, 'Error fetching role.');
    });
});

roleRoutes.put('/:id', authenticate, (req, res) => {
  Role.findById(req.params.id)
    .then((role) => {
      role.update(req.body);
      res.send({
        success: 'Role updated successfully',
        title: role.title
      });
    })
    .catch((err) => {
      handleError(res, err.message, 'Role cannot be updated.');
    });
});

roleRoutes.delete('/:id', authenticate, (req, res) => {
  Role.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.send({
        success: 'Role has been deleted.'
      });
    })
    .catch((err) => {
      handleError(res, err.message, 'Role cannot be created.');
    });
});

module.exports = roleRoutes;
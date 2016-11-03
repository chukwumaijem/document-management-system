const models = require('../models/dbconnect');

function handleError(res, reason, message, code) {
  console.log('ERROR:' + reason);
  res.status(code || 500).json({ 'error': message });
};

const roleControl = {
  createRole: function (req, res) {
    models.Role.create(req.body)
      .then((role) => {
        res.send({
          success: "Role created"
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Role cannot be created.');
      });
  },

  getRoles: function (req, res) {
    models.Role.findAll({})
      .then((role) => {
        res.json(role);
      })
      .catch((err) => {
        handleError(res, err.message, 'Error fetching role.');
      });
  },

  updateRole: function (req, res) {
    models.Role.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      .then((role) => {
        res.send({
          success: 'Role updated successfully',
          title: role.title
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Role cannot be updated.');
      });
  },

  deleteRole: function (req, res) {
    models.Role.destroy({ where: { id: req.params.id } })
      .then(() => {
        res.send({
          success: 'Role has been deleted.'
        });
      })
      .catch((err) => {
        handleError(res, err.message, 'Role cannot be created.');
      });
  }
}

module.exports = roleControl;
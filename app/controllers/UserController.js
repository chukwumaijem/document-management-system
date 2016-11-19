import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models/dbconnect';
import Helpers from './Helpers';

const helperMethods = new Helpers();

/**
 * This class handles user routes
 */
export default class UserController {

  /**
   * This method logs in a user
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  loginUser(req, res, next) {
    if (!req.body.username) {
      res.status(400)
        .send({ error: 'Username is required.' });
      return;
    }
    if (!req.body.password) {
      res.status(400)
        .send({ error: 'Password is required.' });
      return;
    }
    models.User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = this.createToken({
            id: user.id,
            username: user.username,
            RoleId: user.RoleId
          });
          res.status(200)
            .send({
              success: 'Login successful.',
              token
            });
        } else {
          res.status(400)
            .send({
              error: 'Login failed. Username or password invalid.'
            });
        }
      }).catch((err) => {
        err.reason = 'Login failed.';
        err.code = 404;
        next(err);
      });
  }

  /**
   * This method fetches all the users
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  getUser(req, res, next) {
    models.User.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: models.Role
      }]
    }).then((user) => {
      if (user.id === req.decoded.id || req.decoded.RoleId === 1) {
        res.send(user);
      } else {
        res.status(401).json({ error: 'You do not have permission to view user data.' });
      }
    }).catch((err) => {
      err.reason = 'Error getting user';
      next(err);
    });
  }


  /**
   * This method fetches a specified user's data
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  getUsers(req, res, next) {
    models.User.findAll({
      include: [{
        model: models.Role
      }]
    })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        err.reason = 'Error getting users';
        next(err);
      });
  }


  /**
   * This method fetches a users' documents
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  getDocuments(req, res, next) {
    models.Document.findAll({
      where: { ownerId: req.params.id },
      include: [{ model: models.Role }, { model: models.User, as: 'owner' }]
    }).then((document) => {
      res.status(200).send(helperMethods.filterDocs(req, document));
    }).catch((err) => {
      err.reason = 'Error getting user documents';
      next(err);
    });
  }


  /**
   * This method creates a new user
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  createUser(req, res, next) {
    if (!req.body.username || !req.body.firstName ||
      !req.body.lastName || !req.body.email || !req.body.password) {
      res.status(400).send({
        error: 'User data incomplete.'
      });
      return;
    }

    models.User.create(req.body)
      .then((user) => {
        const token = this.createToken({
          id: user.id,
          username: user.username,
          RoleId: user.RoleId
        });
        res.status(201)
          .send({
            user,
            token,
            success: 'User created.'
          });
      }).catch((err) => {
        err.reason = 'User already exist.';
        err.code = 409;
        next(err);
      });
  }


  /**
   * This method updates users data
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  updateUser(req, res, next) {
    if (req.body.RoleId && req.decoded.RoleId !== 1) {
      res.status(401).send({ error: 'Only an admin can change roles.' });
      return;
    }
    models.User.findOne({
      where: { id: req.params.id }
    }).then((user) => {
      if (user.id === req.decoded.id || req.decoded.RoleId === 1) {
        user.update(req.body);
        res.send({
          success: 'User data updated.',
          user
        });
      } else {
        res.status(401)
          .send({ error: 'You do not have permission to update user data.' });
      }
    }).catch((err) => {
      err.reason = 'Update failed.';
      next(err);
    });
  }


  /**
   * This method deletes user
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   */
  deleteUser(req, res, next) {
    models.User.findOne({
      where: { id: req.params.id }
    }).then((user) => {
      if (user.id === req.decoded.id || req.decoded.RoleId === 1) {
        user.destroy();
        res.send({
          success: 'User data deleted.',
          username: user.username
        });
      } else {
        res.status(401).send({ error: 'You do not have permission to delete user.' });
      }
    }).catch((err) => {
      err.reason = 'Cannot delete data.';
      next(err);
    });
  }


  /**
   * This method creates tokens for users
   *
   * @param {Object} userdata
   * @returns {String} token
   */
  createToken(userdata) {
    return jwt.sign(userdata, process.env.secret, { expiresIn: 60 });
  }
}

import models from '../models/dbconnect';
import Helpers from './Helpers';

const helperMethods = new Helpers();

/**
 * DocumentController class
 * Contains functions for manipulating documents
 */
export default class DocumentController {

  /**
   * This method gets all documents in the system
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res or next
   */
  getDocuments(req, res, next) {
    models.Document.findAll({
      include: [
        { model: models.Role },
        { model: models.User, as: 'owner' }
      ],
      order: [['createdAt', 'DESC']]
    }).then((documents) => {
      res.send(helperMethods.filterDocs(req, documents));
    }).catch((err) => {
      err.reason = 'Error fetching documents.';
      next(err);
    });
  }

  /**
   * This method gets a specified document
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res or next
   */
  getDocument(req, res, next) {
    if (Object.keys(req.query).length) {
      return this.searchDocument(req, res, next);
    }
    models.Document.findById(req.params.id, {
      include: [{ model: models.Role }, { model: models.User, as: 'owner' }]
    }).then((document) => {
      if (!document) {
        return res.status(404)
          .send({ error: 'Document not found.' });
      }
      const result = helperMethods.filterDocs(req, document);
      if (!result.length) {
        res.status(401)
          .send({ error: 'You do not have permission to view this document.' });
      } else {
        res.send(result);
      }
    }).catch((err) => {
      err.reason = 'Error fetching documents.';
      next(err);
    });
  }

  /**
   * This method creates a new document.
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res or next
   */
  createDocument(req, res, next) {
    req.ownerId = req.decoded.id;
    models.Document.create(req.body).then((document) => {
      res.status(201)
        .send(document);
    }).catch((err) => {
      err.reason = 'Error creating documents.';
      next(err);
    });
  }

  /**
   * This method updates a document.
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res or next
   */
  updateDocument(req, res, next) {
    models.Document.findOne({
      where: { id: req.params.id }
    }).then((document) => {
      if (document.ownerId === req.decoded.id || req.decoded.RoleId === 1) {
        document.update(req.body);
        res.status(200).send({
          success: 'Document successfully updated.'
        });
      } else {
        res.status(401)
          .send({ error: 'You do not have permission to update this document.' });
      }
    }).catch((err) => {
      err.reason = 'Error updating documents.';
      next(err);
    });
  }

  /**
   * This method deletes a document
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res or next
   */
  deleteDocument(req, res, next) {
    models.Document.findOne({
      where: { id: req.params.id }
    }).then((document) => {
      if (document.ownerId === req.decoded.id || req.decoded.RoleId === 1) {
        document.destroy();
        res.status(200).send({
          success: 'Document deleted.'
        });
      } else {
        res.status(401)
          .send({ error: 'You do not have permission to delete this document.' });
      }
    }).catch((err) => {
      err.reason = 'Error deleting documents.';
      next(err);
    });
  }

  /**
   * This method get documents using query options
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object} res or next
   */
  searchDocument(req, res, next) {
    models.Document.findAll({
      include: [{ model: models.Role },
      { model: models.User, as: 'owner' }
      ],
      order: [['createdAt', 'DESC']],
      offset: req.query.start || 0
    }).then((documents) => {
      res.send(this.filterSearch(req.query, helperMethods.filterDocs(req, documents)));
    }).catch((err) => {
      err.reason = 'Error fetching documents.';
      next(err);
    });
  }

  /**
   * This method filters documents by date
   *
   * @param {Object} date
   * @param {Array} documents
   * @returns {Boolean} true or false
   */
  dateFilter(date, documents) {
    return documents.filter(document =>
      date === JSON.stringify(document.createdAt).substr(1, 10));
  }

  /**
   * This method filters documents by role
   *
   * @param {String} role
   * @param {Array} documents
   * @returns {Object} true or false
   */
  roleFilter(role, documents) {
    return documents.filter(document =>
      role.toLowerCase() === document.Role.title.toLowerCase());
  }

  /**
   * This method filters documents
   *
   * @param {Object} query
   * @param {Array} docs
   * @returns {Array} true or false
   */
  filterSearch(query, docs) {
    let documents = docs;
    if (query.date) {
      documents = this.dateFilter(query.date, documents);
    }
    if (query.role) {
      documents = this.roleFilter(query.role, documents);
    }
    if (query.limit && documents.length > query.limit) {
      documents.length = query.limit;
    }

    return documents;
  }
}

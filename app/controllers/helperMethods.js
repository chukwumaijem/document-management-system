'use strict';
const jwt = require('jsonwebtoken');

class HelperMethod {
  constructor(models) {
    this.models = models;
  }

  searchDocument(req, res, next) {
    this.models.Document.findAll({
      include: [{ model: this.models.Role },
      { model: this.models.User, as: 'owner' }
      ],
      order: [['createdAt', 'DESC']],
      offset: req.query.start || 0
    }).then((documents) => {
      res.send(this.filterSearch(req.query, this.filterDocs(req, documents)));
    }).catch((err) => {
      err.reason = 'Error fetching documents.';
      next(err);
    });
  }

  filterDocs(req, documents) {
    if (!Array.isArray(documents)) {
      documents = [documents];
    }
    return documents.filter((document) => {
      const isPublic = document.public;
      const isAdmin = req.decoded && req.decoded.id === 1;
      const isOwner = req.decoded && req.decoded.id === document.ownerId;

      return isPublic || isAdmin || isOwner;
    });
  }

  dateFilter(date, documents) {
    return documents.filter((document) => {
      return date === JSON.stringify(document.createdAt).substr(1, 10);
    });
  }

  roleFilter(role, documents) {
    return documents.filter((document) => {
      return role.toLowerCase() === document.Role.title.toLowerCase();
    });
  }

  filterSearch(query, documents) {
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


  createToken(userdata) {
    return jwt.sign(userdata, process.env.secret, { expiresIn: 60 });
  }
}

module.exports = HelperMethod;
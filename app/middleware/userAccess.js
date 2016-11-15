'use strict';

const jwt = require('jsonwebtoken');

const userAccess = function (req, res, next) {
  const token = req.body.token || req.query.token ||
    req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.secret, function (err, decoded) {
      if (err) {
        return res.status(401)
          .json({ error: err.message });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    next();
  }
};

module.exports = userAccess;
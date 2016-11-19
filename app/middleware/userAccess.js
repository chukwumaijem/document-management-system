import jwt from 'jsonwebtoken';

/**
 * This function allows all users access
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {void}
 */
export default function userAccess(req, res, next) {
  const token = req.body.token || req.query.token ||
    req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.secret, (err, decoded) => {
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
}

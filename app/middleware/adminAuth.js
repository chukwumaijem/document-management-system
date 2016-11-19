import jwt from 'jsonwebtoken';

/**
 * This function authenticates admins
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {void}
 */
export default function adminAccess(req, res, next) {
  const token = req.body.token || req.query.token ||
    req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err) {
        return res.status(401)
          .json({ error: err.message });
      } else if (decoded.id === 1) {
        req.decoded = decoded;
        next();
      } else {
        res.status(401).send({
          error: 'You do not have permission.'
        });
      }
    });
  } else {
    return res.status(401).send({
      error: 'No token provided.'
    });
  }
}

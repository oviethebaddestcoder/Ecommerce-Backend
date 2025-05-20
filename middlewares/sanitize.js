// middlewares/sanitize.js

const prohibitedKeys = ['$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin', '$or', '$and', '$not', '$nor', '$regex'];

function sanitize(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  for (const key in obj) {
    if (prohibitedKeys.includes(key)) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitize(obj[key]);
    }
  }

  return obj;
}

module.exports = (req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.query && typeof req.query === 'object') req.query = sanitize({ ...req.query });
  if (req.params) sanitize(req.params);

  next();
};

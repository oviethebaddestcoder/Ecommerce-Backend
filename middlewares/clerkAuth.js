const { getAuth } = require('@clerk/clerk-sdk-node');

exports.requireAuth = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.auth = auth;
  next();
};

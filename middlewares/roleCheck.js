const User = require('../models/User');

const requireRole = (role) => async (req, res, next) => {
  const user = await User.findOne({ firebaseUID: req.firebaseUser.uid });
  if (!user || user.role !== role) {
    return res.status(403).json({ message: 'Access denied' });
  }

  req.user = user;
  next();
};

module.exports = requireRole;

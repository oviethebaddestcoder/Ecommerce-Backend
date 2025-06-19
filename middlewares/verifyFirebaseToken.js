const admin = require('../service/firebaseAdmin');
const User = require('../models/User');

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = await admin.auth().verifyIdToken(token);

    // Try to find or create the user in MongoDB
    let user = await User.findOne({ firebaseUID: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUID: decoded.uid,
        email: decoded.email,
        name: decoded.name || '',
        role: 'user', // default
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

module.exports = verifyFirebaseToken;

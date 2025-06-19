const User = require('../../models/User');

const syncUser = async (req, res) => {
  const { uid, email, name } = req.firebaseUser;

  try {
    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      user = await User.create({
        firebaseUID: uid,
        email,
        name: name || '',
      });
    }

    res.status(200).json({ message: 'User synced', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to sync user', error: err.message });
  }
};

module.exports = { syncUser };

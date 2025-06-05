const User = require('../../models/User');
const { clerkClient } = require('@clerk/clerk-sdk-node');

// Helper: Sync Clerk user with MongoDB
const syncClerkUserToDB = async (clerkUser, role = 'user') => {
  const existingUser = await User.findOne({ clerkId: clerkUser.id });
  if (existingUser) return existingUser;

  return await User.create({
    clerkId: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    userName: clerkUser.username || clerkUser.firstName || 'User',
    role,
    isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
  });
};

// Register regular user
const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      username,
    });

    const dbUser = await syncClerkUserToDB(clerkUser, 'user');
    res.status(201).json({ user: dbUser });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Register admin
const registerAdmin = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      username,
    });

    const dbUser = await syncClerkUserToDB(clerkUser, 'admin');
    res.status(201).json({ user: dbUser });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Sync signed-in Clerk user to MongoDB
const syncLoggedInUser = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth;

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const dbUser = await syncClerkUserToDB(clerkUser);

    res.status(200).json({ user: dbUser });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
};

module.exports = {
  registerUser,
  registerAdmin,
  syncLoggedInUser,
};

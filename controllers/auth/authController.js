const User = require('../models/user-model');
const { clerkClient } = require('@clerk/clerk-sdk-node');

// Helper to sync Clerk user to MongoDB
async function syncClerkUserToDB(clerkUser, role = 'user') {
  const existingUser = await User.findOne({ clerkId: clerkUser.id });
  if (existingUser) return existingUser;

  return await User.create({
    clerkId: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    userName: clerkUser.username || clerkUser.firstName || 'User',
    role,
    isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
  });
}

// Register a regular user
exports.registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      username,
    });

    const dbUser = await syncClerkUserToDB(clerkUser, 'user');
    return res.status(201).json({ user: dbUser });
  } catch (error) {
    console.error('User registration error:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Register an admin
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      username,
    });

    const dbUser = await syncClerkUserToDB(clerkUser, 'admin');
    return res.status(201).json({ user: dbUser });
  } catch (error) {
    console.error('Admin registration error:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Sync the logged-in Clerk user to DB
exports.syncLoggedInUser = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth; // Populated by Clerk middleware
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const dbUser = await syncClerkUserToDB(clerkUser);

    return res.status(200).json({ user: dbUser });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Failed to sync user' });
  }
};

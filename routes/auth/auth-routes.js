const express = require('express');
const {
  registerUser,
  registerAdmin,
  syncLoggedInUser,
} = require('../../controllers/auth/authController');

// Clerk middleware (CommonJS import workaround)
const { requireAuth } = require('@clerk/clerk-sdk-node');

const router = express.Router();

// Public routes
router.post('/register', registerUser);        // User registration
router.post('/admin/register', registerAdmin); // Admin registration

// Protected route for syncing logged-in Clerk user
router.get('/sync', requireAuth({}), syncLoggedInUser);

module.exports = router;

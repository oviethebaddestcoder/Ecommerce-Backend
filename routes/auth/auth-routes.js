const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const { requireAuth } = require('../middleware/clerkAuth');

// Public routes
router.post('/register', authController.registerUser);
router.post('/register-admin', authController.registerAdmin);

// Private (requires Clerk session)
router.get('/me', requireAuth, authController.syncLoggedInUser);

module.exports = router;

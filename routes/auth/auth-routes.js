const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../../middlewares/verifyFirebaseToken');
const { syncUser } = require('../../controllers/auth/authController');

router.post('/sync', verifyFirebaseToken, syncUser);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyEmail,
  loginUser,
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  logoutUser,
  getCurrentUser,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const { authLimiter, emailLimiter } = require("../../middlewares/rateLimiter");

// --- User Registration & Login ---
router.post("/register", authLimiter, registerUser);
router.get("/verify-email", emailLimiter, verifyEmail);
router.post("/login", authLimiter, loginUser);

// --- Admin Registration & Login ---
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

// --- Password Reset ---
router.post("/forgot-password", emailLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

// --- Session Management ---
router.post("/logout", logoutUser);

// --- Auth Check (Session Verification) ---
router.get("/check-auth", authMiddleware(), (req, res) => {
  res.json({ success: true, user: req.user });
});

// --- Protected Routes (Role-Based) ---
router.get("/profile", authMiddleware(), (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get("/admin/dashboard", authMiddleware("admin"), (req, res) => {
  res.json({ success: true, message: "Welcome Admin!", user: req.user });
});

router.get("/user/dashboard", authMiddleware("user"), (req, res) => {
  res.json({ success: true, message: "Welcome User!", user: req.user });
});

router.get("/me", getCurrentUser);

module.exports = router;

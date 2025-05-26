require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/User");
const sendEmail = require("../../utils/sendEmail");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const NODE_ENV = process.env.NODE_ENV;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      userName: user.userName,
    },
    JWT_SECRET,
    { expiresIn: "60m" }
  );
};

const sendTokenResponse = (res, user, message) => {
  const token = generateToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  }).json({
    success: true,
    message,
    user: {
      _id: user._id,
      email: user.email,
      userName: user.userName,
      role: user.role,
    },
  });
};

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (email === ADMIN_EMAIL)
      return res.status(403).json({ success: false, message: "Email reserved for admin." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: "user",
      emailVerificationToken,
    });

    await newUser.save();

    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${emailVerificationToken}&email=${email}`;
    const message = `
      <h2>Please verify your email</h2>
      <p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>
    `;
    await sendEmail(email, "Verify your email", message);

    res.status(201).json({
      success: true,
      message: "Registered successfully! Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  try {
    const user = await User.findOne({ email, emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification token." });
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    res.json({ success: true, message: "Email verified successfully. You can now login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === ADMIN_EMAIL)
      return res.status(403).json({ success: false, message: "Use admin login route." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    if (!user.isVerified)
      return res.status(401).json({ success: false, message: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid password." });

    sendTokenResponse(res, user, "Logged in successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const registerAdmin = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (email !== ADMIN_EMAIL)
      return res.status(403).json({ success: false, message: "Unauthorized admin email." });

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ success: false, message: "Admin already registered." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = new User({
      userName,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    await newAdmin.save();

    res.status(201).json({ success: true, message: "Admin registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== ADMIN_EMAIL)
      return res.status(403).json({ success: false, message: "Unauthorized admin email." });

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid password." });

    sendTokenResponse(res, admin, "Admin logged in successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    const message = `
      <h2>Password reset request</h2>
      <p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>
    `;

    await sendEmail(email, "Password Reset", message);

    res.json({ success: true, message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out successfully." });
};

const authMiddleware = (requiredRole = null) => (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ success: false, message: "Forbidden: insufficient privileges." });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

const getCurrentUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};


module.exports = {
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
};

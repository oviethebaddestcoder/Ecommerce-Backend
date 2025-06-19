const rateLimit = require('express-rate-limit');

// General API limiter — 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

// Auth route limiter (e.g. register, reset password) — 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});

// Email verification / OTP limiter — 5 requests per 10 minutes
const emailLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification requests, please wait 10 minutes and try again later.',
  },
});

// Login brute-force protection — 5 attempts per 10 minutes
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 10 minutes.',
  },
  keyGenerator: (req) => req.ip, // Could be req.body.email for per-user lock
  skipSuccessfulRequests: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  emailLimiter,
  loginLimiter, // ✅ Add to exports
};

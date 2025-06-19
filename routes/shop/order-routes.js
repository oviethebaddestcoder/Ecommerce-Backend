const express = require("express");
const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  verifyPayment,
} = require("../../controllers/shop/order-controller");

const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");
const requireRole = require("../../middlewares/roleCheck");

const router = express.Router();

// ✅ All routes require logged-in users
router.use(verifyFirebaseToken, requireRole("user"));

// POST /api/user/orders/create - Create a new order
router.post("/create", createOrder);

// POST /api/user/orders/capture - Capture / verify payment
router.post("/capture", verifyPayment);

// GET /api/user/orders/list - Get current user's orders
router.get("/list", getAllOrdersByUser);

// GET /api/user/orders/details/:id - Get specific order (must belong to user)
router.get("/details/:id", getOrderDetails);

module.exports = router;

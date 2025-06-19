const express = require("express");
const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");
const requireRole = require("../../middlewares/roleCheck");

const router = express.Router();

// All routes below require admin privileges
router.use(verifyFirebaseToken, requireRole("admin"));

// GET /api/admin/orders/get - Get all orders (admin only)
router.get("/get", getAllOrdersOfAllUsers);

// GET /api/admin/orders/details/:id - Get specific order (admin only)
router.get("/details/:id", getOrderDetailsForAdmin);

// PUT /api/admin/orders/update/:id - Update order status (admin only)
router.put("/update/:id", updateOrderStatus);

module.exports = router;

const express = require("express");
const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");
const requireRole = require("../../middlewares/roleCheck");

const router = express.Router();

// ✅ Secure all routes with Firebase Auth + user role
router.use(verifyFirebaseToken, requireRole("user"));

// POST /api/user/cart - Add product to cart
router.post("/", addToCart);

// GET /api/user/cart - Get current user's cart
router.get("/", fetchCartItems);

// PUT /api/user/cart - Update quantity
router.put("/", updateCartItemQty);

// DELETE /api/user/cart/:productId - Remove product from cart
router.delete("/:productId", deleteCartItem);

module.exports = router;

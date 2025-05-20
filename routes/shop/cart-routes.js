const express = require("express");
const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

// Add product to cart
router.post("/:userId/add", addToCart);

// Get user's cart
router.get("/:userId", fetchCartItems);

// Update cart item quantity
router.put("/:userId/update", updateCartItemQty);

// Delete cart item
router.delete("/:userId/product/:productId", deleteCartItem);

module.exports = router;

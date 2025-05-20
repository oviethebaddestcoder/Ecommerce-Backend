const express = require("express");
const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

// Add product to cart
router.post("/users/:userId/cart/add", addToCart);

// Get user's cart
router.get("/users/:userId/cart", fetchCartItems);

// Update cart item quantity
router.put("/users/:userId/cart/update", updateCartItemQty);

// Delete cart item
router.delete("/users/:userId/cart/product/:productId", deleteCartItem);

module.exports = router;

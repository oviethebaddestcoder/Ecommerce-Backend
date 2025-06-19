const express = require("express");
const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");
const requireRole = require("../../middlewares/roleCheck");

const router = express.Router();

// 🔐 Only logged-in users can post a review
router.post("/add", verifyFirebaseToken, requireRole("user"), addProductReview);

// 🌍 Public route – anyone can see reviews
router.get("/product/:productId", getProductReviews);

module.exports = router;

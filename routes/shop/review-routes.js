const express = require("express");

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/product/:productId", getProductReviews);

module.exports = router;
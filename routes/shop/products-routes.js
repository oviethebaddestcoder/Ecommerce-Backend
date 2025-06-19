const express = require("express");
const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

// GET /api/products/get?filters=... - Fetch filtered products for shop
router.get("/get", getFilteredProducts);

// GET /api/products/get/:id - Get details of a single product
router.get("/get/:id", getProductDetails);

module.exports = router;

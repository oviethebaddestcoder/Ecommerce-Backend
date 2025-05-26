const express = require("express");
const { searchProducts } = require("../../controllers/shop/search-controller");

const router = express.Router();

// Example: /api/search/query?keyword=cap&page=1&limit=12
router.get("/query", searchProducts);

module.exports = router;

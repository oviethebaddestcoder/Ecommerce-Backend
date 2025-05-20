const express = require("express");

const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const router = express.Router();

// Add address for user
router.post("/users/:userId/addresses/add", addAddress);

// Get all addresses for user
router.get("/users/:userId/addresses", fetchAllAddress);

// Delete address for user
router.delete("/users/:userId/addresses/:addressId", deleteAddress);

// Update address for user
router.put("/users/:userId/addresses/:addressId", editAddress);

module.exports = router;

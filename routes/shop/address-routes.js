const express = require("express");
const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const router = express.Router();

// Add address for user
router.post("/:userId/add", addAddress);

// Get all addresses for user
router.get("/:userId", fetchAllAddress);

// Delete address for user
router.delete("/:userId/:addressId", deleteAddress);

// Update address for user
router.put("/:userId/:addressId", editAddress);

module.exports = router;

const express = require("express");
const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");
const requireRole = require("../../middlewares/roleCheck");

const router = express.Router();

// ✅ All routes require user to be logged in
router.use(verifyFirebaseToken, requireRole("user"));

// POST /api/user/addresses - Add address
router.post("/", addAddress);

// GET /api/user/addresses - Get all addresses of the logged-in user
router.get("/", fetchAllAddress);

// PUT /api/user/addresses/:addressId - Update a specific address
router.put("/:addressId", editAddress);

// DELETE /api/user/addresses/:addressId - Delete a specific address
router.delete("/:addressId", deleteAddress);

module.exports = router;

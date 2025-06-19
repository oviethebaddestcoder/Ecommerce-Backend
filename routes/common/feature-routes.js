const express = require("express");
const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controllers/common/feature-controller");

const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");
const requireRole = require("../../middlewares/roleCheck");

const router = express.Router();

// 🔐 Only admin can add feature images
router.post("/add", verifyFirebaseToken, requireRole("admin"), addFeatureImage);

// 🌍 Public route to get feature images (homepage)
router.get("/get", getFeatureImages);

module.exports = router;

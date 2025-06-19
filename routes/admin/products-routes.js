const express = require("express");
const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");
const imageUploadUtil = require("../../helpers/cloudinary");

const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");
const requireRole = require("../../middlewares/roleCheck");

const router = express.Router();

// ✅ Protect all routes with admin role
router.use(verifyFirebaseToken, requireRole("admin"));

// POST /api/admin/products/upload-image
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const result = await imageUploadUtil(req.file);
    res.status(200).json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// POST /api/admin/products/add
router.post("/add", addProduct);

// PUT /api/admin/products/edit/:id
router.put("/edit/:id", editProduct);

// DELETE /api/admin/products/delete/:id
router.delete("/delete/:id", deleteProduct);

// GET /api/admin/products/get
router.get("/get", fetchAllProducts);

module.exports = router;

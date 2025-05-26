const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword = "", page = 1, limit = 12 } = req.query;

    if (typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword must be a string.",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const query = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Product.find(query).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching products",
    });
  }
};

module.exports = { searchProducts };

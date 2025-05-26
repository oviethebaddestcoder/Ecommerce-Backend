const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    // Optionally add pagination here if needed
    // const limit = parseInt(req.query.limit) || 20;
    // const page = parseInt(req.query.page) || 1;
    // const skip = (page - 1) * limit;

    // const products = await Product.find(filters)
    //   .sort(sort)
    //   .skip(skip)
    //   .limit(limit)
    //   .lean();

    const products = await Product.find(filters).sort(sort).lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).lean();

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };

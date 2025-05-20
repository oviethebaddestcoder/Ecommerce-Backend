const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");
const sanitize = require("./middlewares/sanitize"); 
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  credentials: true, // allow cookies to be sent
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options("*", cors(corsOptions));

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// Security & compression
app.use(compression());
app.use(sanitize);
app.use(helmet());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

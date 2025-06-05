const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
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
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const app = express();
const PORT = process.env.PORT || 5000;


// ✅ Set security HTTP headers 
app.set("trust proxy", 1);


// ✅ CORS should be the FIRST middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chizzy-cap-ecommerce-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);



// ✅ Then parse cookies and JSON
app.use(cookieParser());
app.use(express.json());
app.use(ClerkExpressWithAuth())


// ✅ Security and performance middlewares
app.use(compression());
app.use(sanitize); 
app.use(helmet());

// ✅ Connect to DB
connectDB();

// ✅ Routes
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

// ✅ Listen.....
app.listen(PORT, () =>
  console.log(`Server is now running on port ${PORT}`)
);

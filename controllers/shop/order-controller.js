const axios = require("axios");
const mongoose = require("mongoose");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      paymentMethod,
      totalAmount,
      cartId,
      email,
    } = req.body;

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !cartItems?.length ||
      totalAmount <= 0 ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // 1. Create temporary order
    const order = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount,
      orderDate: new Date(),
    });

    await order.save();

    // 2. Initialize Paystack payment
    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: totalAmount * 100, // Paystack uses kobo (₦1000 = 100000)
        reference: `order_${order._id}`,
        callback_url: `http://localhost:5173/shop/paystack-verify?orderId=${order._id}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url } = paystackRes.data.data;

    res.status(200).json({
      success: true,
      authorization_url,
      orderId: order._id,
    });
  } catch (err) {
    console.error("Paystack Init Error:", err.response?.data || err);
    res.status(500).json({
      success: false,
      message: "Failed to initialize Paystack payment",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference, orderId } = req.query;

    if (!reference || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification data",
      });
    }

    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = verifyRes.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update payment details
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentData.id;
    order.payerId = paymentData.customer.id;
    order.orderUpdateDate = new Date();

    // Decrease stock
    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.title}`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    // Remove cart
    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed and payment successful",
      data: order,
    });
  } catch (err) {
    console.error("Payment Verification Error:", err.response?.data || err);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
    });
  }
};

    

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getAllOrdersByUser,
  getOrderDetails,
};
import dotenv from "dotenv";
dotenv.config();

import UserModel from "../model/userModel.js";
import OrderModel from "../model/orderModel.js";
import Stripe from "stripe";

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY || "Not Found");

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing from the environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    // 1️⃣ Create order in MongoDB **before** payment
    const newOrder = new OrderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false, // Payment is pending until verified
    });

    await newOrder.save(); // ✅ Save order in MongoDB

    console.log("✅ New Order Created:", newOrder);

    // 2️⃣ Prepare items for Stripe checkout
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200,
      },
      quantity: 1,
    });

    // 3️⃣ Create Stripe session with orderId
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("❌ Error creating Stripe session:", error);
    res.status(500).json({ message: "Server error while creating payment session." });
  }
};


const verifyOrder = async (req, res) => {
  try {
    console.log("🔍 Received Verification Request:", req.body);

    const { success, orderId } = req.body;

    if (!orderId) {
      console.error("❌ Missing orderId in request body");
      return res.status(400).json({ success: false, message: "Missing order ID" });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      console.error("❌ Order not found in database:", orderId);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === true) {
      order.payment = true;
      await order.save();
      console.log("✅ Payment Verified for Order:", orderId);

      // 🛒 Clear cart after successful payment
      await UserModel.findByIdAndUpdate(order.userId, { cartData: {} });

      return res.json({ success: true, message: "Payment verified, order confirmed. Cart cleared." });
    } else {
      await OrderModel.findByIdAndDelete(orderId);
      console.log("❌ Payment Failed, Order Deleted:", orderId);
      return res.status(400).json({ success: false, message: "Payment failed, order deleted." });
    }
  } catch (error) {
    console.error("❌ Error verifying order:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};




// Get the user order 

const getUserOrders = async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming user ID is retrieved from Auth Middleware

    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }); // Fetch orders for logged-in user

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Server error while fetching orders." });
  }
};

// Listing orders for admin panel
const listOrder = async (req, res) =>{
  try {
    const order = await OrderModel.find({});
    res.json({success:true, data: order})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
  }
}

// ✅ Update order status safely
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.status(400).json({ success: false, message: "Order ID and status are required." });

    const updatedOrder = await OrderModel.findOneAndUpdate({ _id: orderId }, { status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ success: false, message: "Order not found." });

    return res.json({ success: true, message: "Status updated successfully.", order: updatedOrder });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    return res.status(500).json({ success: false, message: "Server error while updating status." });
  }
};

export { placeOrder, verifyOrder, getUserOrders, listOrder, updateStatus };

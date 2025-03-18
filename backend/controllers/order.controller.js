import { Order } from "../models/order.model.js";
import { sendShippingEmail, sendDeliveredEmail } from "../utils/emailService.js";

// Get orders for logged-in users
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("books.book", "title coverImage price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving orders: ${error.message}` });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("books.book", "title coverImage price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Error fetching orders: ${error.message}` });
  }
};

// Update Order Status & Send Shipping/Delivery Emails (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending", "Shipped", "Delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const order = await Order.findById(orderId).populate("user").populate("books.book");
    if (!order) return res.status(404).json({ message: "Order not found." });

    const previousStatus = order.status;
    order.status = status;

    if (status === "Shipped" && previousStatus !== "Shipped") {
      order.shippedAt = new Date();
      await sendShippingEmail(order.user.email, order.user.name, order);
    }

    if (status === "Delivered" && previousStatus !== "Delivered") {
      await sendDeliveredEmail(order.user.email, order.user.name, order);
    }

    await order.save();
    res.json({ message: `Order status updated to ${status}.`, order });
  } catch (error) {
    res.status(500).json({ message: `Error updating order: ${error.message}` });
  }
};

// Delete Order (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    await order.deleteOne();
    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error deleting order: ${error.message}` });
  }
};

import Stripe from "stripe";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Book } from "../models/book.model.js";
import { sendConfirmationEmail } from "../utils/emailService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "Cart is empty." });

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.book.title,
          images: item.book.coverImage ? [item.book.coverImage] : [],
        },
        unit_amount: Math.round(item.book.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: { userId: req.user.id },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: `Stripe error: ${error.message}` });
  }
};

// Confirm Payment & Save Order
export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ message: "Session ID is required." });

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed." });
    }

    const user = await User.findById(session.metadata.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const books = (
      await Promise.all(
        session.line_items?.data?.map(async (item) => {
          const book = await Book.findOne({ title: item.price?.product?.name });
          return book ? { book: book._id, title: book.title, price: item.price.unit_amount / 100, quantity: item.quantity || 1 } : null;
        })
      )
    ).filter(Boolean);

    if (books.length === 0) return res.status(400).json({ message: "No valid books found." });

    let order = await Order.findOne({ stripeSessionId: session.id });
    if (!order) {
      order = new Order({
        user: user._id,
        books,
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        isPaid: true,
        paidAt: new Date(),
        paymentDetails: {
          paymentIntentId: session.payment_intent,
          paymentMethod: session.payment_method_types[0],
        },
        trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      await order.save();
      await sendConfirmationEmail(user.email, user.name, order);
    }

    res.json({ message: "Payment confirmed.", order });
  } catch (error) {
    res.status(500).json({ message: `Error confirming payment: ${error.message}` });
  }
};

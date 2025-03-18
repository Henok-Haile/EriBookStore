import { Newsletter } from "../models/newsletter.model.js";
import { sendEmail } from "../utils/emailService.js";
import crypto from "crypto";

/**
 * Subscribe to Newsletter
 */
export const subscribeNewsletter = async (req, res) => {
  try {
    let { email } = req.body;

    if (req.user) {
      email = req.user.email;
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "You are already subscribed." });
    }

    const unsubscribeToken = crypto.randomBytes(20).toString("hex");

    const newSubscriber = new Newsletter({ email, unsubscribeToken });
    await newSubscriber.save();

    const unsubscribeLink = `http://localhost:5173/unsubscribe/${unsubscribeToken}`;
    const emailContent = `
      <h2>Welcome to EriBookStore!</h2>
      <p>Thank you for subscribing!</p>
      <p>To unsubscribe, click <a href="${unsubscribeLink}">here</a>.</p>
      <br>
      <p>- The EriBookStore Team</p>
    `;

    await sendEmail(email, "Welcome to EriBookStore!", emailContent);

    return res.status(201).json({ message: "Subscription successful. Check your email for confirmation." });
  } catch (error) {
    console.error("Error in newsletter subscription:", error);
    return res.status(500).json({ message: "Server error while subscribing." });
  }
};

/**
 * Unsubscribe from Newsletter
 */
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { token } = req.params;

    const subscriber = await Newsletter.findOneAndDelete({ unsubscribeToken: token });

    if (!subscriber) {
      return res.status(410).json({ message: "This unsubscribe link has expired or is invalid." });
    }

    const emailContent = `
      <h2>You've Unsubscribed</h2>
      <p>We're sorry to see you go! You have been successfully removed from our newsletter.</p>
      <p>- The EriBookStore Team</p>
    `;

    await sendEmail(subscriber.email, "You have unsubscribed", emailContent);

    return res.json({ message: "You have successfully unsubscribed." });
  } catch (error) {
    console.error("Error in newsletter unsubscription:", error);
    return res.status(500).json({ message: "Server error while unsubscribing." });
  }
};

/**
 * Check Subscription Status
 */
export const checkSubscription = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const subscriber = await Newsletter.findOne({ email });

    res.json({
      subscribed: !!subscriber,
      unsubscribeToken: subscriber ? subscriber.unsubscribeToken : null,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    res.status(500).json({ message: "Server error while checking subscription." });
  }
};

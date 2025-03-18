import nodemailer from "nodemailer";
import { Newsletter } from "../models/newsletter.model.js"; // Use named import

// Email Transport Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Verification Email
export const sendVerificationEmail = async (email, token, name) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"EriBookStore" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - EriBookStore",
      html: `
        <h2>Hello, ${name}!</h2>
        <p>Welcome to EriBookStore. Please click the link below to verify your email:</p>
        <a href="${verificationUrl}" target="_blank" style="display:inline-block;padding:10px 20px;color:#fff;background:#007bff;text-decoration:none;border-radius:5px;">
          Verify Email
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error.message);
  }
};

// Send Password Reset Email
export const sendResetPasswordEmail = async (email, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"EriBookStore" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - EriBookStore",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:10px 20px;color:#fff;background:#ff5733;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset email:", error.message);
  }
};

// General Email Sending Function
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"EriBookStore" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

// Send Promotional Emails to Subscribers
export const sendPromotionalEmail = async (subject, content) => {
  try {
    const subscribers = await Newsletter.find();
    const emails = subscribers.map((sub) => sub.email);

    for (const email of emails) {
      await sendEmail(email, subject, content);
    }
  } catch (error) {
    console.error("Error sending promotional emails:", error.message);
  }
};

// Send Order Confirmation Email
export const sendConfirmationEmail = async (userEmail, userName, orderDetails) => {
  const emailContent = `
    <h2>Thank You for Your Order, ${userName}!</h2>
    <p>Your order has been successfully placed. Here are the details:</p>
    <ul>
      ${orderDetails.books
        .map((book) => `<li><strong>${book.title}</strong> - $${book.price} x ${book.quantity}</li>`)
        .join("")}
    </ul>
    <p><strong>Total:</strong> $${orderDetails.totalAmount}</p>
    <p>We will update you when your order is shipped.</p>
  `;

  await sendEmail(userEmail, "Order Confirmation - EriBookStore", emailContent);
};

// Send Shipping Confirmation Email
export const sendShippingEmail = async (userEmail, userName, orderDetails) => {
  const emailContent = `
    <h2>Your Order is On Its Way, ${userName}!</h2>
    <p>Your order has been shipped. Here are the details:</p>
    <ul>
      ${orderDetails.books
        .map((book) => `<li><strong>${book.title}</strong> - $${book.price} x ${book.quantity}</li>`)
        .join("")}
    </ul>
    <p><strong>Total:</strong> $${orderDetails.totalAmount}</p>
    <p>Your tracking number: <strong>${orderDetails.trackingNumber || "N/A"}</strong></p>
  `;

  await sendEmail(userEmail, "Your Order Has Been Shipped - EriBookStore", emailContent);
};

// Send Order Delivered Email
export const sendDeliveredEmail = async (userEmail, userName, orderDetails) => {
  const emailContent = `
    <h2>Your Order Has Been Delivered, ${userName}!</h2>
    <p>We hope you love your new books! Here’s your order summary:</p>
    <ul>
      ${orderDetails.books
        .map((book) => `<li><strong>${book.title}</strong> - $${book.price} x ${book.quantity}</li>`)
        .join("")}
    </ul>
    <p><strong>Total:</strong> $${orderDetails.totalAmount}</p>
    <p>We’d love to hear your feedback! Please leave us a review.</p>
    <p>Thank you for shopping with EriBookStore!</p>
  `;

  await sendEmail(userEmail, "Your Order Has Been Delivered!", emailContent);
};

import cron from "node-cron";
import { sendEmail } from "./emailService.js";
import { Newsletter } from "../models/newsletter.model.js";
import { Book } from "../models/book.model.js";

// Function to Send Newsletters
const sendNewsletter = async () => {
  try {
    const subscribers = await Newsletter.find();
    if (!subscribers.length) return;

    for (const subscriber of subscribers) {
      // Fetch books based on user's preferred genre
      const recommendedBooks = await Book.find({ category: subscriber.preferredGenre })
        .sort({ createdAt: -1 })
        .limit(5);

      const bookList = recommendedBooks.length
        ? recommendedBooks
            .map(
              (book) =>
                `<li><a href="${process.env.FRONTEND_URL}/books/${book._id}">${book.title}</a></li>`
            )
            .join("")
        : "<li>No new books available in this category.</li>";

      // Fetch discounted books
      const discountedBooks = await Book.find({ discount: { $gt: 0 } }).limit(3);
      const discountList = discountedBooks.length
        ? discountedBooks
            .map(
              (book) =>
                `<li><a href="${process.env.FRONTEND_URL}/books/${book._id}">${book.title} - ${book.discount}% Off</a></li>`
            )
            .join("")
        : "<li>No discounted books at the moment.</li>";

      // Email Content
      const emailContent = `
        <h2>Hello, ${subscriber.email}</h2>
        <p>Check out this week's book updates, recommendations, and discounts:</p>

        <h3>Personalized Book Recommendations (${subscriber.preferredGenre})</h3>
        <ul>${bookList}</ul>

        <h3>Exclusive Discounted Books</h3>
        <ul>${discountList}</ul>

        <p>If you wish to unsubscribe, <a href="${process.env.FRONTEND_URL}/unsubscribe/${subscriber.unsubscribeToken}">click here</a>.</p>

        <p>- The EriBookStore Team</p>
      `;

      await sendEmail(subscriber.email, "Your Weekly Book Update", emailContent);
    }
  } catch (error) {
    console.error("Error sending newsletter:", error.message);
  }
};

// Schedule Weekly Newsletter (Every Monday at 9 AM)
cron.schedule("0 9 * * MON", sendNewsletter, {
  timezone: "UTC",
});

// Send Welcome Email After Subscription
export const sendWelcomeEmail = async (email, unsubscribeToken) => {
  try {
    const emailContent = `
      <h2>Welcome to EriBookStore Newsletter!</h2>
      <p>Thank you for subscribing to our book updates, recommendations, and special discounts.</p>
      <p>If you ever wish to unsubscribe, you can do so here:</p>
      <a href="${process.env.FRONTEND_URL}/unsubscribe/${unsubscribeToken}">Unsubscribe</a>
      <p>- The EriBookStore Team</p>
    `;

    await sendEmail(email, "Welcome to EriBookStore!", emailContent);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
  }
};

// Send Unsubscription Confirmation Email
export const sendUnsubscribeEmail = async (email) => {
  try {
    const emailContent = `
      <h2>You Have Unsubscribed</h2>
      <p>We're sad to see you go! You have been successfully unsubscribed from our newsletter.</p>
      <p>If this was a mistake, you can <a href="${process.env.FRONTEND_URL}/subscribe">subscribe again</a>.</p>
      <p>- The EriBookStore Team</p>
    `;

    await sendEmail(email, "Unsubscribed from EriBookStore", emailContent);
  } catch (error) {
    console.error("Error sending unsubscribe email:", error.message);
  }
};

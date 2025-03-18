import express from "express";
import { 
  subscribeNewsletter, 
  unsubscribeNewsletter, 
  checkSubscription 
} from "../controllers/newsletter.controller.js";

const router = express.Router();

// Newsletter Routes
router.post("/subscribe", subscribeNewsletter);
router.get("/unsubscribe/:token", unsubscribeNewsletter);
router.get("/check", checkSubscription);

export default router;

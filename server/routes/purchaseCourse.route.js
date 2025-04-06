import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, stripeWebhook } from "../controllers/coursePurchase.controller.js";
import { verifyPayment,paymentSuccess } from "../controllers/coursePurchase.controller.js";
const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(express.raw({type:"application/json"}), stripeWebhook);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
router.route("/verify-payment/:id").get(isAuthenticated,verifyPayment)
router.route("/payment-success").get(isAuthenticated,paymentSuccess)

router.route("/").get(isAuthenticated,getAllPurchasedCourse);

export default router;
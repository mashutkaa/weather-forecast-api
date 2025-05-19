import express from "express";

import {
    handleSubscribe,
    handleConfirm,
    handleRequestUnsubscribe,
    handleUnsubscribe,
} from "../controllers/subscriptionController.js";
import validateSubscription from "../middlewares/inputValidator.js";

const router = express.Router();

router.post("/subscribe", validateSubscription, handleSubscribe);
router.get("/confirm/:token", handleConfirm);
router.post("/unsubscribe", handleRequestUnsubscribe);
router.get("/unsubscribe/:token", handleUnsubscribe);

export default router;

import express from "express";

import {
    handleSubscribe,
    handleConfirm,
    handleUnsubscribe,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/subscribe", handleSubscribe);
router.get("/confirm/:token", handleConfirm);
router.get("/unsubscribe/:token", handleUnsubscribe);

export default router;

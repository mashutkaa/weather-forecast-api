const express = require("express");

const {
    handleSubscribe,
    handleConfirm,
    handleRequestUnsubscribe,
    handleUnsubscribe,
} = require("../controllers/subscriptionController");

const validateSubscription = require("../middlewares/inputValidator");

const router = express.Router();

router.post("/subscribe", validateSubscription, handleSubscribe);
router.get("/confirm/:token", handleConfirm);
router.post("/unsubscribe", handleRequestUnsubscribe);
router.get("/unsubscribe/:token", handleUnsubscribe);

module.exports = router;

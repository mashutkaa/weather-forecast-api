import crypto from "crypto";
import pool from "../config/db.js";

import {
    getSubscriptionByEmail,
    createSubscription,
    confirmSubscription,
    deleteSubscriptionByToken,
} from "../models/subscriptionModel.js";
import { sendConfirmationEmail } from "../services/email/sendConfirmationEmail.js";

// 📩 POST /subscribe
export const handleSubscribe = async (req, res, next) => {
    const { email, city, frequency } = req.body;

    if (!email || !city || !frequency) {
        return res
            .status(400)
            .json({ message: "Email, city and frequency are required" });
    }

    const client = await pool.connect();

    try {
        const existing = await getSubscriptionByEmail(email);
        if (existing) {
            client.release();
            return res
                .status(409)
                .json({ message: "Email is already subscribed" });
        }

        await client.query("BEGIN");

        const token = crypto.randomBytes(16).toString("hex");
        const newSub = await createSubscription(
            client,
            email,
            city,
            frequency,
            token,
        );

        await sendConfirmationEmail(email, token); // якщо тут помилка — rollback

        await client.query("COMMIT");
        client.release();

        return res.status(201).json({
            message: "Subscription created. Please confirm via email.",
            subscription: {
                email: newSub.email,
                city: newSub.city,
                frequency: newSub.frequency,
                confirmed: newSub.confirmed,
            },
        });
    } catch (error) {
        await client.query("ROLLBACK");
        client.release();
        next(error);
    }
};

// ✅ GET /confirm/:token
export const handleConfirm = async (req, res, next) => {
    const { token } = req.params;

    try {
        const confirmedSub = await confirmSubscription(token);

        if (!confirmedSub) {
            return res
                .status(404)
                .json({ message: "Invalid or expired token" });
        }

        return res.json({ message: "Subscription confirmed!" });
    } catch (error) {
        next(error);
    }
};

// ❌ GET /unsubscribe/:token
export const handleUnsubscribe = async (req, res, next) => {
    const { token } = req.params;

    try {
        const unsubscribed = await deleteSubscriptionByToken(token);

        if (!unsubscribed) {
            return res.status(404).json({ message: "Invalid token" });
        }

        return res.json({ message: "You have been unsubscribed." });
    } catch (error) {
        next(error);
    }
};

const crypto = require("crypto");
const pool = require("../config/db");

const {
    getSubscriptionByEmail,
    createSubscription,
    confirmSubscription,
    deleteSubscriptionByToken,
} = require("../models/subscriptionModel");
const { sendEmail } = require("../services/email/emailService");

const handleSubscribe = async (req, res, next) => {
    const { email, city, frequency } = req.body;

    if (!email || !city || !frequency) {
        return res.status(400).json({
            status: 400,
            description: "Invalid input",
        });
    }

    const client = await pool.connect();

    try {
        const existing = await getSubscriptionByEmail(email);
        if (existing) {
            client.release();
            return res.status(409).json({
                status: 409,
                description: "Email already subscribed",
            });
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

        const confirmationUrl = `${process.env.API_URL}/confirm/${token}`;

        const subject = "Активація підписки на погоду";
        const text = `Щоб підтвердити свою підписку, перейдіть за посиланням: ${confirmationUrl}`;
        const html = `
      <h1>Підтвердження підписки</h1>
      <p>Щоб підтвердити свою підписку, натисніть на посилання нижче:</p>
      <a href="${confirmationUrl}">Підтвердити підписку</a>
      <p>Якщо ви не підписувалися, просто проігноруйте цей лист.</p>
    `;

        try {
            await sendEmail({ to: email, subject, text, html });
        } catch (error) {
            console.error("Email sending error:", error);
            await client.query("ROLLBACK");
            client.release();
            return res
                .status(500)
                .json({ message: "Помилка при відправці листа" });
        }

        await client.query("COMMIT");
        client.release();

        return res.status(200).json({
            status: 200,
            description: "Subscription successful. Confirmation email sent.",
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

const handleConfirm = async (req, res, next) => {
    const { token } = req.params;

    try {
        const confirmedSub = await confirmSubscription(token);

        if (!confirmedSub) {
            return res.status(404).json({
                status: 404,
                description: "Token not found",
            });
        }

        return res.status(200).json({
            status: 200,
            description: "Subscription confirmed successfully",
        });
    } catch (error) {
        next(error);
    }
};

const handleRequestUnsubscribe = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ status: 400, description: "Email required" });
    }

    try {
        const sub = await getSubscriptionByEmail(email);

        if (!sub) {
            return res.status(404).json({
                status: 404,
                description: "Subscription not found",
            });
        }

        const unsubscribeLink = `${process.env.API_URL}/unsubscribe/${sub.token}`;

        await sendEmail({
            to: email,
            subject: "Відписка від погоди",
            html: `
        <h2>Скасування підписки</h2>
        <p>Натисніть <a href="${unsubscribeLink}">сюди</a>, щоб скасувати підписку.</p>
      `,
        });

        return res.status(200).json({
            status: 200,
            description: "Unsubscribe email sent",
        });
    } catch (error) {
        next(error);
    }
};

const handleUnsubscribe = async (req, res, next) => {
    const { token } = req.params;

    const isValidTokenFormat = /^[a-f0-9]{32}$/i.test(token);
    if (!isValidTokenFormat) {
        return res.status(400).json({
            status: 400,
            description: "Invalid token",
        });
    }

    try {
        const unsubscribed = await deleteSubscriptionByToken(token);

        if (!unsubscribed) {
            return res.status(404).json({
                status: 404,
                description: "Token not found",
            });
        }

        return res.status(200).json({
            status: 200,
            description: "Unsubscribed successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleSubscribe,
    handleConfirm,
    handleRequestUnsubscribe,
    handleUnsubscribe,
};

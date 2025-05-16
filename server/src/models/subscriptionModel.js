import pool from "../config/db.js";

// Отримати підписку за email
export const getSubscriptionByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM subscriptions WHERE email = $1",
        [email],
    );
    return result.rows[0];
};

// Створити підписку (непідтверджену)
export const createSubscription = async (
    client,
    email,
    city,
    frequency,
    token,
) => {
    const result = await client.query(
        "INSERT INTO subscriptions (email, city, frequency, token) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, city, frequency, token],
    );
    return result.rows[0];
};

// Підтвердити підписку за токеном
export const confirmSubscription = async (token) => {
    const result = await pool.query(
        `UPDATE subscriptions
     SET confirmed = TRUE
     WHERE token = $1
     RETURNING *`,
        [token],
    );
    return result.rows[0];
};

// Видалити підписку за токеном (відписка)
export const deleteSubscriptionByToken = async (token) => {
    const result = await pool.query(
        `DELETE FROM subscriptions
     WHERE token = $1
     RETURNING *`,
        [token],
    );
    return result.rows[0];
};

// Отримати всі підписки з щогодинною частотою
export const getHourlySubscriptions = async () => {
    const result = await pool.query(
        `SELECT * FROM subscriptions
     WHERE frequency = 'hourly' AND confirmed = TRUE`,
    );
    return result.rows;
};

// Отримати всі підписки з щоденною частотою
export const getDailySubscriptions = async () => {
    const result = await pool.query(
        `SELECT * FROM subscriptions
     WHERE frequency = 'daily' AND confirmed = TRUE`,
    );
    return result.rows;
};

const pool = require("../config/db");

const getSubscriptionByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM subscriptions WHERE email = $1",
        [email],
    );
    return result.rows[0];
};

const createSubscription = async (client, email, city, frequency, token) => {
    const result = await client.query(
        "INSERT INTO subscriptions (email, city, frequency, token) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, city, frequency, token],
    );
    return result.rows[0];
};

const confirmSubscription = async (token) => {
    const result = await pool.query(
        `UPDATE subscriptions
         SET confirmed = TRUE
         WHERE token = $1
         RETURNING *`,
        [token],
    );
    return result.rows[0];
};

const deleteSubscriptionByToken = async (token) => {
    const result = await pool.query(
        `DELETE FROM subscriptions
         WHERE token = $1
         RETURNING *`,
        [token],
    );
    return result.rows[0];
};

const getHourlySubscriptions = async () => {
    const result = await pool.query(
        `SELECT * FROM subscriptions
         WHERE frequency = 'hourly' AND confirmed = TRUE`,
    );
    return result.rows;
};

const getDailySubscriptions = async () => {
    const result = await pool.query(
        `SELECT * FROM subscriptions
         WHERE frequency = 'daily' AND confirmed = TRUE`,
    );
    return result.rows;
};

module.exports = {
    getSubscriptionByEmail,
    createSubscription,
    confirmSubscription,
    deleteSubscriptionByToken,
    getHourlySubscriptions,
    getDailySubscriptions,
};

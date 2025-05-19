const pool = require("../config/db");

const createSubscriptionsTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      city TEXT NOT NULL,
      frequency TEXT NOT NULL CHECK (frequency IN ('hourly', 'daily')),
      token TEXT NOT NULL,
      confirmed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    try {
        await pool.query(query);
        console.log("Subscriptions table created successfully");
    } catch (error) {
        console.error("Error creating subscriptions table:", error);
    }
};

module.exports = createSubscriptionsTable;

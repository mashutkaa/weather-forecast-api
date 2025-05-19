const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const pool = require("./config/db.js");

const weatherRoutes = require("./routes/weatherRoutes.js");
const subscriptionRoutes = require("./routes/subscriptionRoutes.js");

const errorHandling = require("./middlewares/errorHandler.js");

const createSubscriptionsTable = require("./data/createSubscriptionsTable.js");

require("./cron/sendForecast.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", weatherRoutes);
app.use("/api", subscriptionRoutes);

// Error handling middleware
app.use(errorHandling);

// Create table before starting the server
createSubscriptionsTable();

// Testing POSTGRESQL connection
app.get("/", async (req, res) => {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is: ${result.rows[0].current_database}`);
});

// Server running
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

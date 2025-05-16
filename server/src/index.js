import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/db.js";

import weatherRoutes from "./routes/weatherRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

import errorHandling from "./middlewares/errorHandler.js";

import createSubscriptionsTable from "./data/createSubscriptionsTable.js";

import "./cron/sendForecast.js";

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

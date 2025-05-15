import express from "express";

const router = express.Router();

router.get("/weather", async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: "City is required" });
        }

        const weatherData = {
            city,
            temperature: 25,
            condition: "Sunny",
        };
        res.json(weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

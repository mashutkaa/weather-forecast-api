const { fetchWeatherFromAPI } = require("../services/weather/getWeather");

const getWeather = async (req, res, next) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({
            status: 400,
            description: "City is required",
        });
    }

    try {
        const weatherData = await fetchWeatherFromAPI(city);

        if (!weatherData) {
            return res.status(404).json({
                status: 404,
                description: "City not found",
            });
        }

        return res.status(200).json({
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            description: weatherData.description,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getWeather };

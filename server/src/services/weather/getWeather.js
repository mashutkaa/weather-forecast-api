require("dotenv").config();

async function fetchWeatherFromAPI(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=uk`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text,
        };
    } catch (error) {
        console.error("Error fetching weather:", error.message);
        return null;
    }
}

module.exports = { fetchWeatherFromAPI };

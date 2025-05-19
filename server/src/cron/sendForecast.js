const cron = require("node-cron");
const { fetchWeatherFromAPI } = require("../services/weather/getWeather");
const {
    getHourlySubscriptions,
    getDailySubscriptions,
} = require("../models/subscriptionModel");
const { sendEmail } = require("../services/email/emailService");

const sendWeatherUpdates = async (type) => {
    try {
        const getSubscribers =
            type === "hourly" ? getHourlySubscriptions : getDailySubscriptions;

        const subscribers = await getSubscribers();

        const tasks = subscribers.map(async ({ email, city }) => {
            try {
                let weather = await fetchWeatherFromAPI(city);

                const description =
                    typeof weather?.description === "string"
                        ? weather.description
                        : "Немає даних про погоду";

                const temperature =
                    weather?.temperature !== undefined &&
                    weather.temperature !== null
                        ? weather.temperature
                        : "N/A";

                const humidity =
                    weather?.humidity !== undefined && weather.humidity !== null
                        ? weather.humidity
                        : "N/A";

                weather = { description, temperature, humidity };

                const subject =
                    type === "hourly"
                        ? "Щогодинне оновлення погоди"
                        : "Щоденне оновлення погоди";

                const text = `Погода в ${city}: ${weather.description}, температура: ${weather.temperature}°C, вологість: ${weather.humidity}%`;

                const html = `<h1>Погода в ${city}</h1>
          <p>${weather.description}</p>
          <p>Температура: ${weather.temperature}°C</p>
          <p>Вологість: ${weather.humidity}%</p>
          <small style="color: gray;">* Деякі дані могли бути недоступні під час оновлення</small>`;

                await sendEmail({ to: email, subject, text, html });
            } catch (err) {
                console.error(`[CRON] Помилка для ${email}:`, err.message);
            }
        });

        await Promise.allSettled(tasks);
    } catch (error) {
        console.error(
            `[CRON] Загальна помилка для ${type} розсилки:`,
            error.message,
        );
    }
};

cron.schedule("0 * * * *", () => sendWeatherUpdates("hourly"));
cron.schedule("0 4 * * *", () => sendWeatherUpdates("daily")); // 7 AM за Києвом

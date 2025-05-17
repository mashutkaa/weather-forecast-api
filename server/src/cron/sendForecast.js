import cron from "node-cron";
import { fetchWeatherFromAPI } from "../services/weather/getWeather.js";
import {
    getHourlySubscriptions,
    getDailySubscriptions,
} from "../models/subscriptionModel.js";
import { sendEmail } from "../services/email/emailService.js";

const sendWeatherUpdates = async (type) => {
    try {
        const getSubscribers =
            type === "hourly" ? getHourlySubscriptions : getDailySubscriptions;

        const subscribers = await getSubscribers();

        const tasks = subscribers.map(async ({ email, city }) => {
            try {
                let weather = await fetchWeatherFromAPI(city);

                const hasValidWeather =
                    weather &&
                    typeof weather.description === "string" &&
                    weather.temperature !== undefined &&
                    weather.humidity !== undefined;

                if (!hasValidWeather) {
                    weather = {
                        description: "Немає даних про погоду",
                        temperature: "N/A",
                        humidity: "N/A",
                    };
                }

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
cron.schedule("0 4 * * *", () => sendWeatherUpdates("daily")); // 7 AM in Kyiv

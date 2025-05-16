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

        for (const subscriber of subscribers) {
            const { email, city } = subscriber;

            try {
                const weather = await fetchWeatherFromAPI(city);

                const subject =
                    type === "hourly"
                        ? "Щогодинне оновлення погоди"
                        : "Щоденне оновлення погоди";

                const text = `Погода в ${city}: ${weather.description}, температура: ${weather.temperature}°C, вологість: ${weather.humidity}%`;

                const html = `<h1>Погода в ${city}</h1>
                              <p>${weather.description}</p>
                              <p>Температура: ${weather.temperature}°C</p>
                              <p>Вологість: ${weather.humidity}%</p>`;

                await sendEmail({ to: email, subject, text, html });

                console.log(`[CRON] Лист надіслано: ${email}`);
            } catch (err) {
                console.error(`[CRON] Помилка для ${email}:`, err.message);
            }
        }

        console.log(
            `[CRON] Усього ${
                type === "hourly" ? "щогодинних" : "щоденних"
            } листів: ${subscribers.length}`,
        );
    } catch (error) {
        console.error(
            `[CRON] Загальна помилка для ${type} розсилки:`,
            error.message,
        );
    }
};

cron.schedule("0 * * * *", () => sendWeatherUpdates("hourly"));
cron.schedule("0 4 * * *", () => sendWeatherUpdates("daily")); // 7 AM in Kyiv

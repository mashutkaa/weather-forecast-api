function subscribe() {
    const form = document.querySelector("#subscribe__form form");

    // === Обробка сабміту форми ===
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.querySelector("input[name='email']").value.trim();
        const city = form.querySelector("input[name='city']").value.trim();
        const frequency = form.querySelector(
            "input[name='frequency']:checked",
        ).value;

        try {
            const response = await fetch(
                "http://localhost:5001/api/subscribe",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, city, frequency }),
                },
            );

            const result = await response.json();

            if (response.ok) {
                alert(
                    "Subscription successful! Please check your email to confirm.",
                );
                form.reset();
            } else {
                alert(`Error: ${result.description || "Subscription failed."}`);
            }
        } catch (error) {
            console.error("Subscription error:", error);
            alert("Network error. Please try again later.");
        }
    });

    // === Обробка статусу з URL (після підтвердження) ===
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "confirmed") {
        window.location.href = "/";
        alert("Email successfully confirmed! You're now subscribed.");
    } else if (status === "error") {
        alert("Something went wrong during confirmation. Please try again.");
    }
}

function unsubscibe() {
    const unsubscribeBtn = document.querySelector("#unsubscribe__block button");

    unsubscribeBtn.addEventListener("click", async () => {
        const email = prompt("Please enter your email to unsubscribe:");

        if (!email) {
            alert("You did not enter an email.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5001/api/unsubscribe",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                },
            );

            const result = await response.json();

            if (response.ok) {
                alert(
                    "An email with the unsubscribe link has been sent. Please check your inbox.",
                );
            } else {
                alert(
                    `Error: ${result.description || "Please try again later."}`,
                );
            }
        } catch (error) {
            console.error("Unsubscribe request error:", error);
            alert("Network error. Please try again later.");
        }
    });
}

function getWeatherData() {
    const getWeatherForm = document.querySelector("#find-weather__form form");

    getWeatherForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const city = getWeatherForm
            .querySelector("input[name='city']")
            .value.trim();

        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5001/api/weather?city=${encodeURIComponent(
                    city,
                )}`,
            );

            const result = await response.json();

            if (!response.ok) {
                alert(`${result.description || "Failed to get weather data."}`);
                return;
            }

            const props = document.querySelectorAll(".weather-prop__text");
            props[0].textContent = `${result.humidity}%`;
            props[1].textContent = `${result.temperature}°C`;
            props[2].textContent = result.description;
        } catch (error) {
            console.error("Weather request error:", error);
            alert("Network error. Please try again later.");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    subscribe();
    unsubscibe();
    getWeatherData();
});

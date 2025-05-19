const { fetchWeatherFromAPI } = require("./getWeather");

global.fetch = jest.fn();

describe("fetchWeatherFromAPI", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test("should return weather data for a valid city", async () => {
        const mockResponse = {
            current: {
                temp_c: 21,
                humidity: 60,
                condition: {
                    text: "Сонячно",
                },
            },
        };

        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        const result = await fetchWeatherFromAPI("Kyiv");

        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("Kyiv"));

        expect(result).toEqual({
            temperature: 21,
            humidity: 60,
            description: "Сонячно",
        });
    });

    test("should return null and log error for API error response", async () => {
        const mockErrorResponse = {
            error: {
                message: "No matching location found.",
            },
        };

        console.error = jest.fn();

        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockErrorResponse),
        });

        const result = await fetchWeatherFromAPI("UnknownCity");

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error fetching weather:",
            "No matching location found.",
        );
    });

    test("should return null on network or unexpected error", async () => {
        console.error = jest.fn();

        fetch.mockRejectedValueOnce(new Error("Network error"));

        const result = await fetchWeatherFromAPI("Kyiv");

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error fetching weather:",
            "Network error",
        );
    });
});

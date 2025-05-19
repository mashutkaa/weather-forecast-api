const validateSubscription = require("../middlewares/inputValidator");

describe("validateSubscription middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    test("should call next() for valid input", () => {
        req.body = {
            email: "test@example.com",
            city: "Kyiv",
            frequency: "daily",
        };

        validateSubscription(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test("should return 400 if email is invalid", () => {
        req.body = {
            email: "invalid-email",
            city: "Kyiv",
            frequency: "daily",
        };

        validateSubscription(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 400,
                description: "Invalid input",
                details: expect.arrayContaining(["Invalid email address"]),
            }),
        );
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if city is missing", () => {
        req.body = {
            email: "test@example.com",
            frequency: "daily",
        };

        validateSubscription(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                details: expect.arrayContaining(["City is required"]),
            }),
        );
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if frequency is not valid", () => {
        req.body = {
            email: "test@example.com",
            city: "Kyiv",
            frequency: "weekly",
        };

        validateSubscription(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                details: expect.arrayContaining([
                    "Frequency must be either 'hourly' or 'daily'",
                ]),
            }),
        );
        expect(next).not.toHaveBeenCalled();
    });

    test("should return all validation errors", () => {
        req.body = {
            email: "not-an-email",
            city: "",
            frequency: "monthly",
        };

        validateSubscription(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                details: expect.arrayContaining([
                    "Invalid email address",
                    "City cannot be empty",
                    "Frequency must be either 'hourly' or 'daily'",
                ]),
            }),
        );
        expect(next).not.toHaveBeenCalled();
    });
});

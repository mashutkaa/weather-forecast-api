import Joi from "joi";

const subscriptionScheme = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email має бути рядком",
        "string.email": "Некоректна адреса електронної пошти",
        "any.required": "Email обов’язковий",
    }),
    city: Joi.string().min(1).required().messages({
        "string.base": "Місто має бути рядком",
        "string.empty": "Місто не може бути порожнім",
        "any.required": "Місто обов’язкове",
    }),
    frequency: Joi.string().valid("hourly", "daily").required().messages({
        "any.only": "Частота має бути однією з: hourly, dailyy",
        "any.required": "Частота обов’язкова",
    }),
});

const validateSubscription = (req, res, next) => {
    const { error } = subscriptionScheme.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            description: "Invalid input",
        });
    }
    next();
};

export default validateSubscription;

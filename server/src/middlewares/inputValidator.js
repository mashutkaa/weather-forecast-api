const Joi = require("joi");

const subscriptionSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Invalid email address",
        "any.required": "Email is required",
    }),
    city: Joi.string().min(1).required().messages({
        "string.base": "City must be a string",
        "string.empty": "City cannot be empty",
        "any.required": "City is required",
    }),
    frequency: Joi.string().valid("hourly", "daily").required().messages({
        "any.only": "Frequency must be either 'hourly' or 'daily'",
        "any.required": "Frequency is required",
    }),
});

const validateSubscription = (req, res, next) => {
    const { error } = subscriptionSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            status: 400,
            description: "Invalid input",
            details: error.details.map((d) => d.message),
        });
    }
    next();
};

module.exports = validateSubscription;

import Joi from "joi";

export const registerValidators = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name must be at most 20 characters long",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email format is invalid",
    }),
    password: Joi.string().min(6).max(20).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must be at most 20 characters long",
    }),
});

export const loginValidators = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email format is invalid",
    }),
    password: Joi.string().min(6).max(20).required().messages({
        "string.min": "Password must be at least 6 characters",
    }),
});

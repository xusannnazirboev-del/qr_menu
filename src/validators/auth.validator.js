import Joi from "joi";

export const registerValidators = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "string.min": "Ism kamida 3 ta belgidan iborat bolishi kerak",
        "string.max": "Ism uzogi bilan 20 ta belgidan iborat bolishi kerak",
        "any.required": "Ism kiritilmagan",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email formati notogri",
        "any.required": "Email kiritilmagan",
    }),
    password: Joi.string().min(6).max(20).required().messages({
        "string.min": "Parol kamida 3 ta belgidan iborat bolishi kerak",
        "string.max": "Parol uzogi bilan 20 ta belgidan iborat bolishi kerak",
        "any.required": "Parol kiritilmagan",
    }),
});

export const loginValidators = Joi.object({

    email: Joi.string().email().required().messages({
        "string.email": "Email formati notogri",
        "any.required": "Email kiritilmagan",
    }),
    name: Joi.string().min(6).max(20).required().messages({
        "string.min": "Parol kamida 3 ta belgidan iborat bolishi kerak",
        "any.required": "Parol kiritilmagan",
    }),
});

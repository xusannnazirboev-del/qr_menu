import Joi from "joi";

export const categoryValidators = Joi.object({
    name: Joi.string().min(2).max(20).required().messages({
        "string.min": "Kategoriya nomi kamida 3 ta belgidan iborat bolishi kerak",
        "string.max": "Kategoriya nomi uzogi bilan 20 ta belgidan iborat bolishi kerak",
        "any.required": "Kategoriya nomi kiritilmagan",
    }),
});
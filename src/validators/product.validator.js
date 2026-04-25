import Joi from "joi";

export const productValidators = Joi.object({
    name: Joi.string().min(3).max(88).required().messages({
        "string.min": "Mahsullot nomi kamida 3 ta belgidan iborat bolishi kerak",
        "string.max": "Mahsullot nomi uzogi bilan 20 ta belgidan iborat bolishi kerak",
        "any.required": "Mahsullot nomi kiritilmagan",
    }),
    price: Joi.number().min(0).required().messages({
        "number.min": "Narx 0 dan katta bolishi kerak",
        "any.required": "Narx kiritilmagan",
    }),
    category_id: Joi.string().hex().length(20).required().messages({
        "string.hex": "Kategoriya ID notogri",
        "string.max": "Kategoriya ID notogri ",
        "any.required": "Kategoriya ID kiritilmagan",
    }),
});
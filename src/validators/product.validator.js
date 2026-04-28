import Joi from "joi";

export const productValidators = Joi.object({
    name: Joi.string().min(3).max(88).required().messages({
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name must be at most 20 characters long",
    }),
    price: Joi.number().min(0).required().messages({
        "number.min": "price must be at least 0 characters",
    }),
    category_id: Joi.string().optional().allow("").messages({
        "string.base": "Kategoriya noto'g'ri",
    }),
});
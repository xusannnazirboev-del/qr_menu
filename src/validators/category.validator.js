import Joi from "joi";

export const categoryValidators = Joi.object({
    name: Joi.string().min(2).max(20).required().messages({
        "string.min": "Categogry must be at least 3 characters",
        "string.max": "Categogry must be at most 20 characters long",
    }),
});
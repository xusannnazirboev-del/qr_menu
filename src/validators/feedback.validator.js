import Joi from "joi";

export const feedbackValidator = Joi.object({
    message: Joi.string().min(3).max(500).required().messages({
        "string.min": "Xabar kamida 3 ta belgidan iborat bo'lishi kerak",
        "string.max": "Xabar uzogi 500 ta belgidan iborat bo'lishi kerak",
        "any.required": "Xabar kiritilmagan",
    }),
    type: Joi.string().valid("review", "complaint").required().messages({
        "any.only": "Type faqat 'review' yoki 'complaint' bo'lishi mumkin",
        "any.required": "Type kiritilmagan",
    }),
});

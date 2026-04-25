import Joi from "joi";

export const feedbackValidator = Joi.object({
    message: Joi.string().min(3).max(500).required().messages({
        "string.min": "Message must be at least 3 characters",
        "string.max": "Message must be at most 500 characters long",
    }),
    type: Joi.string().valid("review", "complaint").required().messages({
        "any.only": "Type faqat 'review' yoki 'complaint' bo'lishi mumkin",
    }),
    phone: Joi.string().optional().allow(""),
    otp: Joi.string().optional().allow(""),
});

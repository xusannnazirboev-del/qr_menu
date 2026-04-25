import { Router } from "express";
import feedbackController from "../controllers/feedback.controller.js";
import { Protected } from "../middleware/protected.middleware.js";
import { Roles } from "../middleware/roles.middleware.js";
import { upload } from "../configs/multer.config.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import { feedbackValidator } from "../validators/feedback.validator.js";

const feedbackRouter = Router();

feedbackRouter
    .get("/", Protected(), Roles("ADMIN"), feedbackController.getAll)
    .post(
        "/",
        Protected(false),
        upload.single("image"),
        ValidationMiddleware(feedbackValidator),
        feedbackController.create,
    )
    .post("/send-otp", Protected(false), feedbackController.sendOtpFeedback);

export default feedbackRouter;

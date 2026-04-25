import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import {
    loginValidators,
    registerValidators,
} from "../validators/auth.validator.js";

const authRouter = Router();

authRouter
    .post(
        "/register",
        ValidationMiddleware(registerValidators),
        authController.register,
    )
    .post("/login", ValidationMiddleware(loginValidators), authController.login)
    .post("/refresh", authController.refresh)
    .post("/forgot-password", authController.forgotPassword)
    .post("/reset-password", authController.resetPassword);

export default authRouter;

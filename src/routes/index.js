import { Router } from "express";
import authRouter from "./auth.router.js";
import categoryRouter from "./category.router.js";
import productRouter from "./product.router.js";
import feedbackRouter from "./feedback.router.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter).use("/categories",categoryRouter).use("/products",productRouter).use("/feedback", feedbackRouter)


export default apiRouter
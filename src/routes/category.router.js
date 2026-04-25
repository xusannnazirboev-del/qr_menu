import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import { Roles } from "../middleware/roles.middleware.js";
import { Protected } from "../middleware/protected.middleware.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import { categoryValidators } from "../validators/category.validator.js";

const categoryRouter = Router();

categoryRouter
    .get("/", Protected(false), categoryController.getAll)
    .post(
        "/",
        Protected(),
        Roles("ADMIN"),
        ValidationMiddleware(categoryValidators),
        categoryController.create,
    )
    .put(
        "/:id",
        Protected(),
        Roles("ADMIN"),
        ValidationMiddleware(categoryValidators),
        categoryController.update,
    )
    .delete("/:id", Protected(), Roles("ADMIN"), categoryController.delete);

export default categoryRouter;

import { Router } from "express";
import { Roles } from "../middleware/roles.middleware.js";
import { Protected } from "../middleware/protected.middleware.js";
import productController from "../controllers/product.controller.js";
import { upload } from "../configs/multer.config.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import { productValidators } from "../validators/product.validator.js";

const productRouter = Router();

productRouter
    .get("/", Protected(false), productController.getAll)
    .post(
        "/",
        Protected(),
        Roles("ADMIN"),
        upload.single("image"),
        ValidationMiddleware(productValidators),
        productController.create,
    )
    .put(
        "/:id",
        Protected(),
        Roles("ADMIN"),
        upload.single("image"),
        ValidationMiddleware(productValidators),
        productController.update,
    )
    .delete("/:id", Protected(), Roles("ADMIN"), productController.delete);

export default productRouter;

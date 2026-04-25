import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { Protected } from "../middleware/protected.middleware.js";
import { Roles } from "../middleware/roles.middleware.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { Feedback } from "../models/feedback.model.js";
import QRCode from "qrcode";

const router = Router();

router.get("/", (req, res) => {
    res.redirect("/login");
});

router.get("/register", (req, res) => {
    res.render("auth/register");
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.get("/menu", async (req, res, next) => {
    try {
        const categories = await Category.find().lean();
        const products = await Product.find()
            .populate("category_id", "name")
            .lean();

        res.render("menu", { categories, products });
    } catch (error) {
        next(error);
    }
});
router.get("/logout", authController.logout);

router.get(
    "/dashboard",
    Protected(),
    Roles("ADMIN"),
    async (req, res, next) => {
        try {
            const [categories, products, feedbacks] = await Promise.all([
                Category.find().lean(),
                Product.find().populate("category_id", "name").lean(),
                Feedback.find().lean(),
            ]);

            const { success, error } = req.query;
            res.render("dashboard", {
                categories,
                products,
                feedbacks,
                success,
                error,
            });
        } catch (error) {
            next(error);
        }
    },
);

router.get("/qr", Protected(), Roles("ADMIN"), async (req, res, next) => {
    try {
        const menuUrl = `${req.protocol}://${req.get("host")}/menu`;
        const qrImage = await QRCode.toDataURL(menuUrl, {
            width: 300,
            color: {
                dark: "#1a1008",
                light: "#f5e6c8",
            },
        });

        res.render("qr", { qrImage, menuUrl });
    } catch (error) {
        next(error);
    }
});
router.get("/feedback", (req, res) => {
    const { type, success, error } = req.query;
    res.render("feedback", { type, success, error });
});
export default router;

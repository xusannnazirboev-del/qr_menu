import { NotFoundException } from "../exceptions/not-found.exception.js";
import { Product } from "../models/product.model.js";
import fs from "fs/promises";
import path from "path";
class ProductController {
    #_productModel;
    constructor() {
        this.#_productModel = Product;
    }
    getAll = async (req, res, next) => {
        try {
            const filter = {};
            if (req.query.category_id) {
                filter.category_id = req.query.category_id;
            }
            const products = await this.#_productModel
                .find(filter)
                .populate("category_id", "name ")
                .lean();

            if (req.headers.accept?.includes("application/json")) {
                return res.json({ success: true, data: products });
            }
            res.render("dashboard", { products });
        } catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const { name, price, category_id } = req.body;
            if (!req.file) {
                return res.redirect("/dashboard?error=Error sending image");
            }
            await this.#_productModel.create({
                name,
                price,
                category_id,
                image_url: `/uploads/${req.file.filename}`,
            });
            res.redirect("/dashboard?success=Product created successfully");
        } catch (error) {
            if (req.file?.filename) {
                await fs
                    .unlink(
                        path.join(
                            process.cwd(),
                            "uploads",
                            req.files.image[0].filename,
                        ),
                    )
                    .catch(() => {});
            }
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { name, price, category_id, image_url } = req.body;
            const { id } = req.params;

            const product = await this.#_productModel.findById(id);
            if (!product) {
                throw new NotFoundException("Not found Product");
            }

            await this.#_productModel.updateOne(
                { _id: id },
                {
                    name,
                    price,
                    category_id,
                    image_url,
                },
            );
            res.redirect("/dashboard?success=Product updated successfully");
        } catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;

            const existing = await this.#_productModel.findById(id);
            if (!existing) {
                throw new NotFoundException("Not found Product");
            }

            await this.#_productModel.deleteOne({ _id: id });
            res.redirect("/dashboard?success=Product Deleted");
        } catch (error) {
            next(error);
        }
    };
}

export default new ProductController();

import mongoose from "mongoose";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { Category } from "../models/category.model.js";

class CategoryController {
    #_categoryModel;
    constructor() {
        this.#_categoryModel = Category;
    }
    getAll = async (req, res, next) => {
        try {
            const categories = await this.#_categoryModel
                .find()
                .populate("user_id", "name email")
                .lean();
            if (req.headers.accept?.includes("application/json")) {
                return res.json({ success: true, data: categories });
            }
            res.render("dashboard", { categories });
        } catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const { name } = req.body;

            console.log("req.user:", req.user);
            const existing = await this.#_categoryModel.findOne({ name });
            if (existing) {
                return res.redirect("/dashboard?error=Category already exists");
            }
            await this.#_categoryModel.create({
                name,
                user_id: new mongoose.Types.ObjectId(req.user.id),
            });
            res.redirect("/dashboard?success=Category created successfully");
        } catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { name } = req.body;
            const { id } = req.params;

            const existing = await this.#_categoryModel.findById(id);
            if (!existing) {
                throw new NotFoundException("Not found Category");
            }

            await this.#_categoryModel.updateOne({ _id: id }, {name});
            res.redirect("/dashboard?success=Category updated successfully");
        } catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;

            const existing = await this.#_categoryModel.findById(id);
            if (!existing) {
                throw new NotFoundException("Not found Category");
            }

            await this.#_categoryModel.deleteOne({ _id: id });
            res.redirect("/dashboard?success=Category Deleted");
        } catch (error) {
            next(error);
        }
    };
}

export default new CategoryController();

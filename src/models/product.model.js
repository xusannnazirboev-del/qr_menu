import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: mongoose.SchemaTypes.String,
            required: true,
        },
        price: {
            type: mongoose.SchemaTypes.Number,
            required: true,
        },
        category_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Category",
            required: true,
        },
        image_url: {
            type: mongoose.SchemaTypes.String,
            required: true,
        },
    },
    {
        collection: "products",
        versionKey: false,
        timestamps: true,
    },
);

export const Product = mongoose.model("Product", ProductSchema);

import mongoose from "mongoose";


const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: mongoose.SchemaTypes.String,
            required: true,
        },
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        collection: "categories",
        versionKey: false,
        timestamps: true,
    },
);
export const Category = mongoose.model("Category", CategorySchema);

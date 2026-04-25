import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
    {
        name: {
            type: mongoose.SchemaTypes.String,
            required: true,
            minlength: [3, "Ism kamida 3ta belgidan iborat bo'lishi kerak"],
        },
        email: {
            type: mongoose.SchemaTypes.String,
            unique: true,
            required: true,
        },
        password: {
            type: mongoose.SchemaTypes.String,
            required: true,
        },
        role: {
            type: mongoose.SchemaTypes.String,
            enum: ["USER", "ADMIN", "VIEWER"],
            default: "USER",
        },
    },
    {
        collection: "users",
        versionKey: false,
        timestamps: true,
    },
);

export const User = mongoose.model("User", UserSchema);

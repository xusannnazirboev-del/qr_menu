import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        message: {
            type: mongoose.SchemaTypes.String,
            
        },
        type: {
            type: mongoose.SchemaTypes.String,
            enum: ["review", "complaint"],
            required: true,
        },
        image_url: {
            type: mongoose.SchemaTypes.String,
            required: false,
        },
        device_info: {
            type: mongoose.SchemaTypes.String,
            required: true,
        },
    },
    {
        collection: "feedback",
        versionKey: false,
        timestamps: true,
    },
);


export const Feedback = mongoose.model("Feedback", FeedbackSchema);
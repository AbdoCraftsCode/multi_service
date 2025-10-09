import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        trim: true,
    },
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],
}, { timestamps: true });

export const ImageModel = mongoose.model("Image", imageSchema);

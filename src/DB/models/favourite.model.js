import mongoose from "mongoose";
const favoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    },
    { timestamps: true }
);

export const FavoriteModel = mongoose.model("Favorite", favoriteSchema);

import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        phone: { type: String, required: true, trim: true },
  
        subdomain: { type: String, required: true, unique: true, trim: true },
        domain: { type: String, },
        password: { type: String, },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    { timestamps: true }
);

export const RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);

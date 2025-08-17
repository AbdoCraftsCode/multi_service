import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    restaurant: { // ⬅️ بدل restaurantName
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restauranttt",
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    websiteLink: {
        type: String
    },
    additionalNotes: {
        type: String,
        default: ""
    },
    products: {
        type: [productSchema],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

export const OrderModel = mongoose.model("Orderrr", orderSchema);

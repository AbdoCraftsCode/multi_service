import mongoose from "mongoose";

const mixSchema = new mongoose.Schema({
    Mostawdaa: { type: mongoose.Types.ObjectId, ref: "Mostawdaa", default: null },
    Product: { type: mongoose.Types.ObjectId, ref: "Product", default: null },
    newprice: { type: Number, },
    oldprice: { type: Number, },
    order: { type: Number, default: 0 } ,
    quantity: {
        en: { type: String,  trim: true },
        ar: { type: String,  trim: true }
    },

}, { timestamps: true });

export const mixModel = mongoose.model("Mix", mixSchema);

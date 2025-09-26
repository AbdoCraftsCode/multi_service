import mongoose, { Schema } from "mongoose";

const rentalPropertySchema = new Schema({
    title: { type: String, required: true }, // العنوان
    location: { type: String, required: true }, // الموقع
    phoneNumber: { type: String, required: true }, // رقم الهاتف

    images: [
        {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],

    description: { type: String, required: true }, // الوصف
    price: { type: Number, required: true }, // السعر

    category: {
        type: String,
        enum: ["department", "hotel", "hall"], // نفس enum في Flutter
        required: true
    },

    isFavorite: { type: Boolean, default: false }, // مفضلة أو لا

    amenities: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {}
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // يربط العقار بالمستخدم اللي كريته
        required: true
    }
}, {
    timestamps: true
});

const RentalPropertyModel = mongoose.model("RentalProperty", rentalPropertySchema);

export default RentalPropertyModel;

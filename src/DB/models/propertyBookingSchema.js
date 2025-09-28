// models/propertyBooking.model.js
import mongoose, { Schema } from "mongoose";

const propertyBookingSchema = new Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "RentalProperty", required: true }, // العقار
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // العميل اللي حجز
    startDate: { type: String, required: true }, // تاريخ البداية
    endDate: { type: String, required: true },   // تاريخ النهاية
    periodType: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        required: true
    }, // نوع الحجز
    additionalNotes: { type: String },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

export const PropertyBookingModel = mongoose.model("PropertyBooking", propertyBookingSchema);

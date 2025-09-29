import mongoose, { Schema, model } from "mongoose";

const paidServiceSchema = new Schema({
    serviceName: { type: String, required: true },       // اسم الخدمة
    invoiceImage: {                                      // صورة الفاتورة
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    subscriptionDuration: { type: Number, required: true }, // مدة الاشتراك بالأيام
    subscriptionPrice: { type: Number, required: true },   // سعر الاشتراك
    phoneNumber: { type: String, required: true },       // رقم الشخص الذي دفع

    userId: { type: Schema.Types.ObjectId, ref: "User" },     // ID الشخص الذي دفع
    // doctorId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // ID الدكتور (إن وجد)
    // ownerId: { type: Schema.Types.ObjectId, ref: "User", default: null },  // ID صاحب العقار (إن وجد)
}, {
    timestamps: true
});

const PaidService = model("PaidService", paidServiceSchema);

export default PaidService;

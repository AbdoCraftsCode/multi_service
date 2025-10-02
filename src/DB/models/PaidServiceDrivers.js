import mongoose, { Schema, model } from "mongoose";

const paidServiceDriversSchema = new Schema({
    serviceName: { type: String, required: true },       // اسم الخدمة
    invoiceImage: {                                      // صورة الفاتورة
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    PonitsNumber: { type: Number, required: true }, // مدة الاشتراك بالأيام

    phoneNumber: { type: String, required: true },       // رقم الشخص الذي دفع

    userId: { type: Schema.Types.ObjectId, ref: "User" },     // ID الشخص الذي دفع

}, {
    timestamps: true
});

const PaidServiceDrivers = model("PaidServiceDrivers", paidServiceDriversSchema);

export default PaidServiceDrivers;

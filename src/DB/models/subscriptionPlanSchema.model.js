import mongoose, { Schema, model } from "mongoose";

const subscriptionPlanSchema = new Schema({
            //   name: { type: String, required: true },// اسم الباقة
    price: { type: Number, required: true },         // السعر
    durationDays: { type: Number, required: true },  // مدة الباقة بالأيام (مثلاً 30 أو 60)
    // description: { type: String, default: "" },      // وصف اختياري
}, {
    timestamps: true
});

const SubscriptionPlan = model("SubscriptionPlan", subscriptionPlanSchema);

export default SubscriptionPlan;

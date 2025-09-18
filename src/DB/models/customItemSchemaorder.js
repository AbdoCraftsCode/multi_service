import mongoose from "mongoose";

// free text product schema (العميل يكتب منتجات بنفسه)
const customItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // مثال: "2 كيلو رز"
    quantity: { type: String, default: "1" } // مثال: "2", أو "كيس"
}, { _id: false });

// المنتجات المختارة من السيستم
const orderProductSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Producttttttt", required: true },
    quantity: { type: Number, default: 1, min: 1 }
}, { _id: false });

// الطلب
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supermarket: { type: mongoose.Schema.Types.ObjectId, ref: "Supermarket", required: true },

    // المنتجات من النظام
    products: { type: [orderProductSchema], default: [] },

    // منتجات يكتبها المستخدم بنفسه
    customItems: { type: [customItemSchema], default: [] },

    // روابط المواقع
    supermarketLocationLink: { type: String, required: true }, // لينك موقع السوبر ماركت
    userLocationLink: { type: String, required: true },        // لينك موقع العميل

    // العنوان النصي
    addressText: { type: String, required: true },

    // ملاحظات
    note: { type: String, default: "" },

    contactPhone: { type: String, required: true },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "in-progress", "delivered", "cancelled"],
        default: "pending"
    },

    totalPrice: { type: Number, default: 0 } // نحسبه لاحقاً
}, { timestamps: true });

export const OrderModellllll = mongoose.model("Orderrrrrrr", orderSchema);

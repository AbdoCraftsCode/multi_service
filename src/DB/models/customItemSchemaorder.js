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
    supermarketLocationLink2: {
        latitude: Number,
        longitude: Number
    },
    userLocationLink2: {
        latitude: Number,
        longitude: Number
    },
    // العنوان النصي
    addressText: { type: String, required: true },
    totalPrice: { type: String,},
    // ✅ الإضافة: مواقع المطعم والعميل
    deliveryPrice: { type: String },
    finalPrice: { type: String },
  
    note: { type: String, default: "" },
    AccountType: { type: String, default: "" },
    Invoice: { type: String, default: "notPaid" },
    InvoicePicture: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },

    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },


    contactPhone: { type: String, required: true },

    status: {
        type: String,
        enum: ["pending", "accepted","picked_up" ,"rejected", "in-progress", "delivered", "cancelled", "deleted", "created","on_the_way"],
        default: "created"
    },

    totalPrice: { type: Number, default: 0 } // نحسبه لاحقاً
}, { timestamps: true });

export const OrderModellllll = mongoose.model("Orderrrrrrr", orderSchema);

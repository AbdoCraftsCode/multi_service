// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         min: 1
//     }
// });

// const orderSchema = new mongoose.Schema({
//     restaurant: { // ⬅️ بدل restaurantName
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Restauranttt",
//         required: true
//     },
//     contactNumber: {
//         type: String,
//         required: true
//     },
//     websiteLink: {
//         type: String
//     },
//     additionalNotes: {
//         type: String,
//         default: ""
//     },
//     products: {
//         type: [productSchema],
//         required: true
//     },
//     createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },

//     status: { // ⬅️ الحالة
//         type: String,
//         enum: ["pending", "accepted", "rejected"],
//         default: "pending"
//     },
// }, { timestamps: true });

// export const OrderModel = mongoose.model("Orderrr", orderSchema);
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

const locationSchema = new mongoose.Schema({
    link: { type: String }, // ✅ الإضافة: اللينك الأصلي زي ما اتكتب
    latitude: { type: Number }, // ✅ الإضافة: الإحداثيات
    longitude: { type: Number } // ✅ الإضافة: الإحداثيات
}, { _id: false });

const orderSchema = new mongoose.Schema({
    restaurant: {
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
    // العنوان النصي
    addressText: { type: String, required: true },
    totalPrice: { type: String, required: true },
    AccountType: { type: String, default: "" },
    Invoice: { type: String, default: "notPaid" },
    InvoicePicture: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    // ✅ الإضافة: مواقع المطعم والعميل
    deliveryPrice: { type: String },
    finalPrice: { type: String },
    restaurantLocation: locationSchema,
    userLocation: locationSchema,
    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },


    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "created", "picked_up","deleted", "delivered", "on_the_way"],
        default: "created"
    },
}, { timestamps: true });

export const OrderModel = mongoose.model("Orderrr", orderSchema);

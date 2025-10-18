// import mongoose from "mongoose";

// const imageSchema = new mongoose.Schema({
//     secure_url: { type: String, required: true },
//     public_id: { type: String, required: true }
// }, { _id: false });
 
// // 📌 Product Schema

// const authorizedUserSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     role: { type: String, enum: ["manager", "staff"], default: "manager" }
// }, { _id: false });

// const productSchema = new mongoose.Schema({
//     restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restauranttt", required: true },
//     name: { type: String, required: true, trim: true },
//     description: { type: String, trim: true },
//     images: { type: [imageSchema], default: [] }, // صور المنتج
//     price: { type: Number, required: true, min: 0 },
//     discount: { type: Number, default: 0, min: 0, max: 100 }, // كنسبة مئوية
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     authorizedUsers: { type: [authorizedUserSchema], default: [] }
// }, { timestamps: true });

// // 📌 Restaurant Schema
// const restaurantSchema = new mongoose.Schema({
//     name: { type: String, required: true, trim: true },
//     cuisine: { type: String, required: true, trim: true },
//     rating: { type: Number, required: true, min: 0, max: 5 },
//     deliveryTime: { type: String, required: true, trim: true },
//     distance: { type: String, required: true, trim: true },
//     image: imageSchema, // صورة المطعم
//     isOpen: { type: Boolean, default: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
// }, { timestamps: true });

// export const RestaurantModell = mongoose.model("Restauranttt", restaurantSchema);
// export const ProductModell = mongoose.model("Productt", productSchema);
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true }
}, { _id: false });

// 📌 Authorized Users Schema
const authorizedUserSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["manager", "staff"], default: "manager" }
}, { _id: false });

// 📌 Restaurant Schema
const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    websiteLink: { type: String, trim: true },
    discripion: { type: String, trim: true },
    phone: { type: String,  trim: true },
    cuisine: { type: String, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    deliveryTime: { type: String, trim: true },
    distance: { type: String, trim: true },
    image: imageSchema,
    menuImages: { type: [imageSchema], default: [] },// صورة المطعم
    isOpen: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorizedUsers: { type: [authorizedUserSchema], default: [] } // ⬅️ هنا
}, { timestamps: true });

// 📌 Product Schema
const productSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restauranttt", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    images: { type: [imageSchema], default: [] }, // صور المنتج
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // كنسبة مئوية
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const RestaurantModell = mongoose.model("Restauranttt", restaurantSchema);
export const ProductModell = mongoose.model("Productt", productSchema);

import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true }
}, { _id: false });

// multi-language sub-schema
const i18nString = new mongoose.Schema({
    en: { type: String, trim: true, default: "" },
    fr: { type: String, trim: true, default: "" },
    ar: { type: String, trim: true, default: "" }
}, { _id: false });

// Section schema (each supermarket has many sections)
const sectionSchema = new mongoose.Schema({
    supermarket: { type: mongoose.Schema.Types.ObjectId, ref: "Supermarket", required: true },
    name: { type: i18nString, required: true }, // name in 3 langs
    description: { type: i18nString, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Product schema inside section
const productSchema = new mongoose.Schema({
    supermarket: { type: mongoose.Schema.Types.ObjectId, ref: "Supermarket", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    name: { type: i18nString, required: true },
    description: { type: i18nString, default: {} },
    images: { type: [imageSchema], default: [] }, // many images per product
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, default: 0, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Supermarket schema
const supermarketSchema = new mongoose.Schema({
    name: { type: i18nString, required: true },
    description: { type: i18nString, default: {} },
    phone: { type: String, trim: true },
    // websiteLink: { type: String, trim: true },
    pickup: {
        latitude: Number,
        longitude: Number
    },
    supermarketLocationLink: { type: String, required: true },
    image: imageSchema, // cover image
    bannerImages: { type: [imageSchema], default: [] },
    isOpen: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorizedUsers: { type: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, role: { type: String, enum: ["manager", "staff"], default: "manager" } }], default: [] }
}, { timestamps: true });

export const SupermarketModel = mongoose.model("Supermarket", supermarketSchema);
export const SectionModel = mongoose.model("Section", sectionSchema);
export const ProductModelllll = mongoose.model("Producttttttt", productSchema);

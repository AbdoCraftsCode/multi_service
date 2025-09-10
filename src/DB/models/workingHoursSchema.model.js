import mongoose, { Schema } from "mongoose";

const workingHoursSchema = new Schema({
    startTime: { type: String, required: true }, // HH:mm format
    endTime: { type: String, required: true },
    isWorking: { type: Boolean, required: true, default: false }
}, { _id: false });

const imageSchema = new Schema({
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true }
}, { _id: false });

const doctorSchema = new Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    location: { type: String, required: true },
    mapLink: { type: String },

    titles: [{ type: String }], // مثال: ["MD", "PhD"]
    // medicalField: {
    //     type: String,
    //     enum: [
    //         'Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics',
    //         'Psychiatry', 'Gynecology', 'Urology', 'Ophthalmology', 'Dentistry',
    //         'General Medicine', 'Surgery'
    //     ],
    //     required: true
    // },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
 
    certificates: [imageSchema], // صور الشهادات من Cloudinary

    workingHours: {
        type: Map,
        of: workingHoursSchema
    },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    profileImage: imageSchema, // صورة البروفايل

    // latitude: { type: Number, required: true },
    // longitude: { type: Number, required: true },

    distanceFromUser: { type: Number }, // يتم حسابه وليس تخزينه

    isFavorite: { type: Boolean, default: false },

    experience: { type: String }, // مثال: "10 years"
    consultationFee: { type: Number }, // سعر الكشف
    hospitalName: { type: String, required: true }
}, { timestamps: true });

const DoctorModel = mongoose.model("Doctor", doctorSchema);
export default DoctorModel;

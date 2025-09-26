// models/Branchhh.model.js
import mongoose from "mongoose";

const modeSchema = new mongoose.Schema({
    managerName: {
        type: String,
        required: true,
        trim: true,
    },

    subGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubGroup", // عدل الاسم حسب اسم الموديل الحقيقي للمجموعة الفرعية
        }
    ],

    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location", // عدل الاسم حسب اسم موديل الموقع
        required: true,
    },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
     
      },
}, { timestamps: true });

export default mongoose.model("mode", modeSchema);

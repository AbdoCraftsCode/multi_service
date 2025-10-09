import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        contact: {
            type: String,
            required: true,
            trim: true,
            // match: [
            //     /^([0-9]{10,15}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/,
            //     "❌ يجب إدخال رقم هاتف صحيح أو بريد إلكتروني صالح",
            // ],
        },
        message: {
            type: String,
            required: true,
            trim: true,
            minlength: [10, "❌ الرسالة يجب ألا تقل عن 10 أحرف"],
        },
        name: {
            type: String,
            required: true,
    
        },


    },
    { timestamps: true }
);

export const ReportModel = mongoose.model("Report", reportSchema);

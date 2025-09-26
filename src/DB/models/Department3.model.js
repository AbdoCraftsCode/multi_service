

import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
    {
        name: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true }
        },
       updatedBy: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                  default: null
              }
    },
    { timestamps: true }
);

export const DepartmentModel = mongoose.model("Department", DepartmentSchema);


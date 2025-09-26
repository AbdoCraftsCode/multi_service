// models/Question.model.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questions: [
        {
            questionText: {
                ar: { type: String, required: true, trim: true },
                en: { type: String, required: true, trim: true },
            },
            evaluation: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Evaluation",
                required: true,
            },
        }
    ],

    mainGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainGroup",
        required: true,
    },

    subGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubGroup",
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export const QuestionModel = mongoose.model("Question", questionSchema);

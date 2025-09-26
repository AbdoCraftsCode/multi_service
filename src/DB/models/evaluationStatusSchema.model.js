import mongoose from "mongoose";

const evaluationStatusSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true // مثال: "جيد"
  },
  percentage: {
    type: Number,
    required: true // مثال: 60
  }
}, { _id: false }); // إلغاء _id داخل العناصر إذا تحب

const evaluationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // مثال: "تقييم المستوى العام"
    trim: true
  },
  statuses: {
    type: [evaluationStatusSchema], // Array of evaluation statuses
    required: true,
    validate: [array => array.length > 0, 'يجب إدخال حالة تقييم واحدة على الأقل']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export const EvaluationModel = mongoose.model("Evaluation", evaluationSchema);

import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Update completedAt when task is completed
TaskSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed) {
    this.completedAt = new Date();
  } else if (this.isModified('completed') && !this.completed) {
    this.completedAt = null;
  }
  next();
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);

import mongoose, { Schema, Document, model, models } from 'mongoose';

// Interface for the Schedule document
export interface ISchedule extends Document {
  fileId: mongoose.Types.ObjectId;
  filename: string;
  uploadDate: Date;
  contentType: string;
}

// Define the schema
const ScheduleSchema = new mongoose.Schema({
  // This stores the GridFS file ID, which is used in the /api/schedule/[fileId] route
  fileId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  contentType: {
    type: String,
    required: true,
  },
}, { 
    // This allows us to sort/index by upload date if needed
    timestamps: true 
});

// Create a unique index to help ensure only one document exists. 
// However, the action logic handles the true singleton behavior.
ScheduleSchema.index({ fileId: 1 }, { unique: true });

// Get the existing model or create a new one
const Schedule = models.Schedule || model<ISchedule>('Schedule', ScheduleSchema);

export default Schedule;
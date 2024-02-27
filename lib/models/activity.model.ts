import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'reply', 'mention'],
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;

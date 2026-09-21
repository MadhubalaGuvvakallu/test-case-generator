const mongoose = require('mongoose');

const userStorySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    acceptanceCriteria: [{ type: String }],
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

userStorySchema.index({ projectId: 1, workflowId: 1 });

module.exports = mongoose.model('UserStory', userStorySchema);

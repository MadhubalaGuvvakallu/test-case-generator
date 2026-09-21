const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  action: { type: String, required: true },
  expectedResult: { type: String, required: true },
});

const testCaseSchema = new mongoose.Schema(
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
    userStoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserStory',
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['positive', 'negative', 'edge', 'validation'],
      default: 'positive',
    },
    format: {
      type: String,
      enum: ['standard', 'bdd', 'bdd2'],
      default: 'standard',
    },
    steps: [stepSchema],
    preconditions: [{ type: String }],
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  { timestamps: true }
);

testCaseSchema.index({ projectId: 1, workflowId: 1 });
testCaseSchema.index({ projectId: 1, userStoryId: 1 });

module.exports = mongoose.model('TestCase', testCaseSchema);

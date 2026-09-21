const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, default: 'default' },
  label: { type: String, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  connections: [{ type: String }],
});

const workflowSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rulesCount: { type: Number, default: 0 },
    userStoriesCount: { type: Number, default: 0 },
    testCasesCount: { type: Number, default: 0 },
    nodes: [nodeSchema],
  },
  { timestamps: true }
);

workflowSchema.index({ projectId: 1 });

module.exports = mongoose.model('Workflow', workflowSchema);

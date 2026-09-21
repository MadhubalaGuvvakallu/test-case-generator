const mongoose = require('mongoose');

const contextFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
    healthScore: { type: Number, min: 0, max: 10, default: 0 },
    contextFiles: [contextFileSchema],
    contextDescription: { type: String, default: '' },
    knowledgeGraphName: { type: String, default: '' },
    totalTestCases: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);

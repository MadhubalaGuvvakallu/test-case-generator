const Workflow = require('../models/Workflow');
const Rule = require('../models/Rule');
const UserStory = require('../models/UserStory');
const TestCase = require('../models/TestCase');

const getWorkflows = async (req, res) => {
  const { projectId } = req.params;
  const workflows = await Workflow.find({ projectId }).sort({ createdAt: 1 });
  res.json({ success: true, data: workflows });
};

const getWorkflow = async (req, res) => {
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) return res.status(404).json({ success: false, message: 'Workflow not found' });
  res.json({ success: true, data: workflow });
};

const approveWorkflow = async (req, res) => {
  const workflow = await Workflow.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!workflow) return res.status(404).json({ success: false, message: 'Workflow not found' });
  res.json({ success: true, data: workflow });
};

const approveAllWorkflows = async (req, res) => {
  const { projectId } = req.body;
  await Workflow.updateMany({ projectId }, { status: 'approved' });
  const workflows = await Workflow.find({ projectId }).sort({ createdAt: 1 });
  res.json({ success: true, data: workflows });
};

const deleteWorkflow = async (req, res) => {
  const workflow = await Workflow.findByIdAndDelete(req.params.id);
  if (!workflow) return res.status(404).json({ success: false, message: 'Workflow not found' });
  await Promise.all([
    Rule.deleteMany({ workflowId: req.params.id }),
    UserStory.deleteMany({ workflowId: req.params.id }),
    TestCase.deleteMany({ workflowId: req.params.id }),
  ]);
  res.json({ success: true, message: 'Workflow deleted' });
};

module.exports = { getWorkflows, getWorkflow, approveWorkflow, approveAllWorkflows, deleteWorkflow };

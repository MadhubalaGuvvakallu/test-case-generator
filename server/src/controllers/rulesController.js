const Rule = require('../models/Rule');

const getRules = async (req, res) => {
  const { projectId } = req.params;
  const { workflowId } = req.query;
  const filter = { projectId };
  if (workflowId) filter.workflowId = workflowId;
  const rules = await Rule.find(filter).sort({ createdAt: 1 });
  res.json({ success: true, data: rules });
};

const updateRule = async (req, res) => {
  const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
  res.json({ success: true, data: rule });
};

const approveRule = async (req, res) => {
  const rule = await Rule.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
  res.json({ success: true, data: rule });
};

const bulkApproveRules = async (req, res) => {
  const { ids, projectId } = req.body;
  const filter = ids?.length ? { _id: { $in: ids } } : { projectId };
  await Rule.updateMany(filter, { status: 'approved' });
  const rules = await Rule.find({ projectId }).sort({ createdAt: 1 });
  res.json({ success: true, data: rules });
};

const bulkDeleteRules = async (req, res) => {
  const { ids } = req.body;
  if (!ids?.length) return res.status(400).json({ success: false, message: 'No ids provided' });
  await Rule.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, message: `${ids.length} rules deleted` });
};

const deleteRule = async (req, res) => {
  const rule = await Rule.findByIdAndDelete(req.params.id);
  if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
  res.json({ success: true, message: 'Rule deleted' });
};

module.exports = { getRules, updateRule, approveRule, bulkApproveRules, bulkDeleteRules, deleteRule };

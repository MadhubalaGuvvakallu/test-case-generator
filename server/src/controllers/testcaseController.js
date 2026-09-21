const TestCase = require('../models/TestCase');
const Project = require('../models/Project');

const getTestCases = async (req, res) => {
  const { projectId } = req.params;
  const { workflowId, userStoryId } = req.query;
  const filter = { projectId };
  if (workflowId) filter.workflowId = workflowId;
  if (userStoryId) filter.userStoryId = userStoryId;
  const testCases = await TestCase.find(filter).sort({ createdAt: 1 });
  res.json({ success: true, data: testCases });
};

const getTestCase = async (req, res) => {
  const tc = await TestCase.findById(req.params.id);
  if (!tc) return res.status(404).json({ success: false, message: 'Test case not found' });
  res.json({ success: true, data: tc });
};

const updateTestCase = async (req, res) => {
  const tc = await TestCase.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tc) return res.status(404).json({ success: false, message: 'Test case not found' });
  res.json({ success: true, data: tc });
};

const approveTestCase = async (req, res) => {
  const tc = await TestCase.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!tc) return res.status(404).json({ success: false, message: 'Test case not found' });
  res.json({ success: true, data: tc });
};

const bulkApproveTestCases = async (req, res) => {
  const { ids, projectId } = req.body;
  const filter = ids?.length ? { _id: { $in: ids } } : { projectId };
  await TestCase.updateMany(filter, { status: 'approved' });

  const count = await TestCase.countDocuments({ projectId });
  await Project.findByIdAndUpdate(projectId, { totalTestCases: count });

  const testCases = await TestCase.find({ projectId }).sort({ createdAt: 1 });
  res.json({ success: true, data: testCases });
};

const bulkDeleteTestCases = async (req, res) => {
  const { ids } = req.body;
  if (!ids?.length) return res.status(400).json({ success: false, message: 'No ids provided' });
  await TestCase.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, message: `${ids.length} test cases deleted` });
};

const deleteTestCase = async (req, res) => {
  const tc = await TestCase.findByIdAndDelete(req.params.id);
  if (!tc) return res.status(404).json({ success: false, message: 'Test case not found' });
  res.json({ success: true, message: 'Test case deleted' });
};

module.exports = {
  getTestCases,
  getTestCase,
  updateTestCase,
  approveTestCase,
  bulkApproveTestCases,
  bulkDeleteTestCases,
  deleteTestCase,
};

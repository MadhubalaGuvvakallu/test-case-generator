const UserStory = require('../models/UserStory');

const getUserStories = async (req, res) => {
  const { projectId } = req.params;
  const { workflowId } = req.query;
  const filter = { projectId };
  if (workflowId) filter.workflowId = workflowId;
  const stories = await UserStory.find(filter).sort({ createdAt: 1 });
  res.json({ success: true, data: stories });
};

const updateUserStory = async (req, res) => {
  const story = await UserStory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!story) return res.status(404).json({ success: false, message: 'User story not found' });
  res.json({ success: true, data: story });
};

const approveUserStory = async (req, res) => {
  const story = await UserStory.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!story) return res.status(404).json({ success: false, message: 'User story not found' });
  res.json({ success: true, data: story });
};

const bulkApproveUserStories = async (req, res) => {
  const { ids, projectId } = req.body;
  const filter = ids?.length ? { _id: { $in: ids } } : { projectId };
  await UserStory.updateMany(filter, { status: 'approved' });
  const stories = await UserStory.find({ projectId }).sort({ createdAt: 1 });
  res.json({ success: true, data: stories });
};

const bulkDeleteUserStories = async (req, res) => {
  const { ids } = req.body;
  if (!ids?.length) return res.status(400).json({ success: false, message: 'No ids provided' });
  await UserStory.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, message: `${ids.length} user stories deleted` });
};

module.exports = {
  getUserStories,
  updateUserStory,
  approveUserStory,
  bulkApproveUserStories,
  bulkDeleteUserStories,
};

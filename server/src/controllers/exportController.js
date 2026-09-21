const Project = require('../models/Project');
const TestCase = require('../models/TestCase');
const exportService = require('../services/exportService');

const exportJSON = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const testCases = await TestCase.find({ projectId, status: 'approved' }).sort({ createdAt: 1 });
  exportService.sendJSONExport(res, testCases, project.name);
};

const exportCSV = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const testCases = await TestCase.find({ projectId, status: 'approved' }).sort({ createdAt: 1 });
  exportService.sendCSVExport(res, testCases, project.name);
};

const exportAll = async (req, res) => {
  const { projectId } = req.params;
  const { format = 'json' } = req.query;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const testCases = await TestCase.find({ projectId }).sort({ createdAt: 1 });

  if (format === 'csv') {
    exportService.sendCSVExport(res, testCases, project.name);
  } else {
    exportService.sendJSONExport(res, testCases, project.name);
  }
};

module.exports = { exportJSON, exportCSV, exportAll };

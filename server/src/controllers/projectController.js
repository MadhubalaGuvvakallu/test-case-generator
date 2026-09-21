const Project = require('../models/Project');
const path = require('path');

const createProject = async (req, res) => {
  const { name } = req.body;
  const project = await Project.create({ name, knowledgeGraphName: name });
  res.status(201).json({ success: true, data: project });
};

const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

const getAllProjects = async (req, res) => {
  const projects = await Project.find({ status: 'active' }).sort({ createdAt: -1 });
  res.json({ success: true, data: projects });
};

const uploadContext = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const { contextDescription } = req.body;
  if (contextDescription !== undefined) {
    project.contextDescription = contextDescription;
  }

  if (req.files && req.files.length > 0) {
    const newFiles = req.files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      mimetype: f.mimetype,
    }));
    project.contextFiles.push(...newFiles);
  }

  await project.save();
  res.json({ success: true, data: project });
};

const archiveProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status: 'archived' },
    { new: true }
  );
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

module.exports = { createProject, getProject, getAllProjects, uploadContext, archiveProject };

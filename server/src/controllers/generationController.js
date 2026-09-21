const Project = require('../models/Project');
const Workflow = require('../models/Workflow');
const Rule = require('../models/Rule');
const UserStory = require('../models/UserStory');
const TestCase = require('../models/TestCase');
const aiService = require('../services/aiService');
const fileService = require('../services/fileService');
const path = require('path');

const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

const generate = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { format = 'standard', category = '', technique = '' } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const requirements = await fileService.buildRequirementsText(
      project.contextFiles,
      project.contextDescription,
      UPLOAD_DIR
    );

    if (!requirements.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No requirements found. Please upload context files or add a description.',
      });
    }

    // Clean up existing data for this project before regenerating
    await Promise.all([
      Workflow.deleteMany({ projectId }),
      Rule.deleteMany({ projectId }),
      UserStory.deleteMany({ projectId }),
      TestCase.deleteMany({ projectId }),
    ]);

    const aiResult = await aiService.generateWorkflows(
      requirements,
      project.contextDescription,
      format,
      category,
      technique
    );

    let totalTestCases = 0;

    for (const wfData of aiResult.workflows) {
      const workflow = await Workflow.create({
        projectId,
        name: wfData.name,
        description: wfData.description || '',
        nodes: wfData.nodes || [],
        rulesCount: (wfData.rules || []).length,
        userStoriesCount: (wfData.userStories || []).length,
        testCasesCount: (wfData.testCases || []).length,
      });

      if (wfData.rules?.length) {
        await Rule.insertMany(
          wfData.rules.map((r) => ({
            projectId,
            workflowId: workflow._id,
            text: r.text,
            tags: r.tags || [],
            priority: r.priority || 'medium',
          }))
        );
      }

      const userStoryDocs = [];
      if (wfData.userStories?.length) {
        const created = await UserStory.insertMany(
          wfData.userStories.map((us) => ({
            projectId,
            workflowId: workflow._id,
            title: us.title,
            description: us.description || '',
            acceptanceCriteria: us.acceptanceCriteria || [],
            tags: us.tags || [],
          }))
        );
        userStoryDocs.push(...created);
      }

      if (wfData.testCases?.length) {
        await TestCase.insertMany(
          wfData.testCases.map((tc, i) => ({
            projectId,
            workflowId: workflow._id,
            userStoryId: userStoryDocs[i % Math.max(userStoryDocs.length, 1)]?._id,
            title: tc.title,
            description: tc.description || '',
            type: tc.type || 'positive',
            format: format,
            steps: tc.steps || [],
            preconditions: tc.preconditions || [],
            tags: tc.tags || [],
            priority: tc.priority || 'medium',
          }))
        );
        totalTestCases += wfData.testCases.length;
      }
    }

    // Compute health score (simple heuristic)
    const healthScore = Math.min(10, Math.round((totalTestCases / 10) + (aiResult.workflows.length * 1.5)));

    await Project.findByIdAndUpdate(projectId, {
      totalTestCases,
      healthScore,
      knowledgeGraphName: project.name,
    });

    const workflows = await Workflow.find({ projectId }).sort({ createdAt: 1 });

    res.json({
      success: true,
      message: 'Test cases generated successfully.',
      data: { workflows, totalTestCases, healthScore },
    });
  } catch (err) {
    next(err);
  }
};

const regenerate = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { feedback } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const existingWorkflows = await Workflow.find({ projectId }).lean();
    const projectContext = {
      name: project.name,
      contextDescription: project.contextDescription,
      workflowCount: existingWorkflows.length,
    };

    const aiResult = await aiService.regenerateTestCases(projectContext, feedback);

    // Cascade delete and re-insert (same as generate)
    await Promise.all([
      Workflow.deleteMany({ projectId }),
      Rule.deleteMany({ projectId }),
      UserStory.deleteMany({ projectId }),
      TestCase.deleteMany({ projectId }),
    ]);

    let totalTestCases = 0;
    for (const wfData of aiResult.workflows || []) {
      const workflow = await Workflow.create({
        projectId,
        name: wfData.name,
        description: wfData.description || '',
        nodes: wfData.nodes || [],
        rulesCount: (wfData.rules || []).length,
        userStoriesCount: (wfData.userStories || []).length,
        testCasesCount: (wfData.testCases || []).length,
      });

      if (wfData.rules?.length) {
        await Rule.insertMany(
          wfData.rules.map((r) => ({
            projectId,
            workflowId: workflow._id,
            text: r.text,
            tags: r.tags || [],
            priority: r.priority || 'medium',
          }))
        );
      }

      const userStoryDocs = [];
      if (wfData.userStories?.length) {
        const created = await UserStory.insertMany(
          wfData.userStories.map((us) => ({
            projectId,
            workflowId: workflow._id,
            title: us.title,
            description: us.description || '',
            acceptanceCriteria: us.acceptanceCriteria || [],
            tags: us.tags || [],
          }))
        );
        userStoryDocs.push(...created);
      }

      if (wfData.testCases?.length) {
        await TestCase.insertMany(
          wfData.testCases.map((tc, i) => ({
            projectId,
            workflowId: workflow._id,
            userStoryId: userStoryDocs[i % Math.max(userStoryDocs.length, 1)]?._id,
            title: tc.title,
            description: tc.description || '',
            type: tc.type || 'positive',
            steps: tc.steps || [],
            preconditions: tc.preconditions || [],
            tags: tc.tags || [],
            priority: tc.priority || 'medium',
          }))
        );
        totalTestCases += wfData.testCases.length;
      }
    }

    await Project.findByIdAndUpdate(projectId, { totalTestCases });
    const workflows = await Workflow.find({ projectId }).sort({ createdAt: 1 });

    res.json({ success: true, data: { workflows, totalTestCases } });
  } catch (err) {
    next(err);
  }
};

module.exports = { generate, regenerate };

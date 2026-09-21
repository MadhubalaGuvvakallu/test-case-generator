import { useCallback } from 'react';
import { useAppContext, STEPS } from '../context/AppContext.jsx';
import * as api from '../services/api.js';

export function useGeneration() {
  const {
    project,
    workflows,
    rules,
    userStories,
    testCases,
    setWorkflows,
    setRules,
    setUserStories,
    setTestCases,
    setStep,
    setLoading,
    setError,
    addMessage,
    updateWorkflow,
    updateRule,
    updateUserStory,
    updateTestCase,
    removeRules,
    removeTestCases,
  } = useAppContext();

  const generate = useCallback(
    async (options) => {
      if (!project) return;
      setLoading(true);
      setError(null);
      try {
        const result = await api.generateTestCases(project._id, options);
        setWorkflows(result.data.workflows);

        const [r, us, tc] = await Promise.all([
          api.getRules(project._id),
          api.getUserStories(project._id),
          api.getTestCases(project._id),
        ]);
        setRules(r);
        setUserStories(us);
        setTestCases(tc);

        setStep(STEPS.REVIEWING_WORKFLOWS);
        addMessage('ai', 'Test Cases are created successfully.');
        addMessage('ai', 'Step 1: Review the Workflows');
        return result;
      } catch (err) {
        setError(err.message);
        addMessage('ai', `Generation failed: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [project, setLoading, setError, setWorkflows, setRules, setUserStories, setTestCases, setStep, addMessage]
  );

  const approveWorkflow = useCallback(
    async (id) => {
      const updated = await api.approveWorkflow(id);
      updateWorkflow(updated);
      return updated;
    },
    [updateWorkflow]
  );

  const approveAllWorkflows = useCallback(async () => {
    if (!project) return;
    const updated = await api.approveAllWorkflows(project._id);
    setWorkflows(updated);
    setStep(STEPS.REVIEWING_RULES);
    addMessage('ai', `All ${updated.length} workflows are approved.`);
    addMessage('ai', 'Step 2: Review the Rules');
  }, [project, setWorkflows, setStep, addMessage]);

  const bulkApproveRules = useCallback(
    async (ids) => {
      if (!project) return;
      const updated = await api.bulkApproveRules(project._id, ids);
      setRules(updated);
      return updated;
    },
    [project, setRules]
  );

  const bulkDeleteRules = useCallback(
    async (ids) => {
      await api.bulkDeleteRules(ids);
      removeRules(ids);
    },
    [removeRules]
  );

  const approveAllRules = useCallback(async () => {
    if (!project) return;
    const updated = await api.bulkApproveRules(project._id, []);
    setRules(updated);
    setStep(STEPS.REVIEWING_USER_STORIES);
    addMessage('ai', `All ${updated.length} rules are approved.`);
    addMessage('ai', 'Step 3: Review the User Stories');
  }, [project, setRules, setStep, addMessage]);

  const bulkApproveUserStories = useCallback(
    async (ids) => {
      if (!project) return;
      const updated = await api.bulkApproveUserStories(project._id, ids);
      setUserStories(updated);
      return updated;
    },
    [project, setUserStories]
  );

  const approveAllUserStories = useCallback(async () => {
    if (!project) return;
    const updated = await api.bulkApproveUserStories(project._id, []);
    setUserStories(updated);
    setStep(STEPS.REVIEWING_TEST_CASES);
    addMessage('ai', `All ${updated.length} user stories are approved.`);
    addMessage('ai', 'Step 4: Review the Test Cases');
  }, [project, setUserStories, setStep, addMessage]);

  const bulkApproveTestCases = useCallback(
    async (ids) => {
      if (!project) return;
      const updated = await api.bulkApproveTestCases(project._id, ids);
      setTestCases(updated);
      return updated;
    },
    [project, setTestCases]
  );

  const bulkDeleteTestCases = useCallback(
    async (ids) => {
      await api.bulkDeleteTestCases(ids);
      removeTestCases(ids);
    },
    [removeTestCases]
  );

  const approveAllTestCases = useCallback(async () => {
    if (!project) return;
    const updated = await api.bulkApproveTestCases(project._id, []);
    setTestCases(updated);
    setStep(STEPS.EXPORT);
    addMessage('ai', `All ${updated.length} test cases are approved.`);
    addMessage('ai', 'Export the Test Cases');
  }, [project, setTestCases, setStep, addMessage]);

  return {
    workflows,
    rules,
    userStories,
    testCases,
    generate,
    approveWorkflow,
    approveAllWorkflows,
    bulkApproveRules,
    bulkDeleteRules,
    approveAllRules,
    bulkApproveUserStories,
    approveAllUserStories,
    bulkApproveTestCases,
    bulkDeleteTestCases,
    approveAllTestCases,
  };
}

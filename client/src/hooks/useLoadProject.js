import { useCallback } from 'react';
import { useAppContext, STEPS } from '../context/AppContext.jsx';
import * as api from '../services/api.js';

/**
 * Fetches all persisted data for an existing project from MongoDB
 * and restores the full application state, allowing users to resume
 * a project after a page refresh or later retrieval.
 */
export function useLoadProject() {
  const { setLoading, setError, loadProject, addMessage } = useAppContext();

  const resumeProject = useCallback(
    async (projectId) => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all collections in parallel
        const [project, workflows, rules, userStories, testCases] = await Promise.all([
          api.getProject(projectId),
          api.getWorkflows(projectId),
          api.getRules(projectId),
          api.getUserStories(projectId),
          api.getTestCases(projectId),
        ]);

        // Determine which step to resume at based on what data exists
        let step = STEPS.CONTEXT_UPLOAD;
        if (testCases.length > 0) {
          const allApproved = testCases.every((tc) => tc.status === 'approved');
          step = allApproved ? STEPS.EXPORT : STEPS.REVIEWING_TEST_CASES;
        } else if (userStories.length > 0) {
          step = STEPS.REVIEWING_USER_STORIES;
        } else if (rules.length > 0) {
          step = STEPS.REVIEWING_RULES;
        } else if (workflows.length > 0) {
          step = STEPS.REVIEWING_WORKFLOWS;
        }

        loadProject(project, workflows, rules, userStories, testCases, step);

        addMessage('ai', `Resumed project **${project.name.toUpperCase()}**. Picking up where you left off.`);
      } catch (err) {
        setError(err.message);
        addMessage('ai', `Error loading project: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, loadProject, addMessage]
  );

  return { resumeProject };
}

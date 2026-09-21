import { useCallback } from 'react';
import { useAppContext, STEPS } from '../context/AppContext.jsx';
import * as api from '../services/api.js';

export function useProject() {
  const { project, setProject, setStep, setLoading, setError, addMessage } = useAppContext();

  const createProject = useCallback(
    async (name) => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.createProject(name);
        setProject(created);
        setStep(STEPS.CONTEXT_UPLOAD);
        addMessage(
          'ai',
          `Project **${created.name.toUpperCase()}** created successfully.`
        );
        addMessage(
          'ai',
          "I can see you have a knowledge graph in the backend. What other contexts would you like me to consider for creating the test cases?"
        );
        return created;
      } catch (err) {
        setError(err.message);
        addMessage('ai', `Error creating project: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setProject, setStep, addMessage]
  );

  const uploadContext = useCallback(
    async (projectId, files, contextDescription) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        if (contextDescription) formData.append('contextDescription', contextDescription);
        files.forEach((f) => formData.append('files', f));

        const updated = await api.uploadContext(projectId, formData);
        setProject(updated);
        setStep(STEPS.GENERATION_OPTIONS);
        addMessage(
          'ai',
          `Associated content updated. Knowledge graph name: **${updated.name.toUpperCase()}**`
        );
        addMessage(
          'ai',
          "Choose the output you'd like to generate:"
        );
        return updated;
      } catch (err) {
        setError(err.message);
        addMessage('ai', `Error uploading context: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setProject, setStep, addMessage]
  );

  return { project, createProject, uploadContext };
}

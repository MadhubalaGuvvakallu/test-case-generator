import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000, // AI calls can take up to 2 min
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ── Projects ──────────────────────────────────────────────
export const createProject = (name) =>
  api.post('/projects', { name }).then((r) => r.data.data);

export const getProject = (id) =>
  api.get(`/projects/${id}`).then((r) => r.data.data);

export const getAllProjects = () =>
  api.get('/projects').then((r) => r.data.data);

export const archiveProject = (id) =>
  api.patch(`/projects/${id}/archive`).then((r) => r.data.data);

export const uploadContext = (projectId, formData) =>
  api
    .post(`/projects/${projectId}/context`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data.data);

// ── Generation ────────────────────────────────────────────
export const generateTestCases = (projectId, options) =>
  api.post(`/generation/${projectId}`, options).then((r) => r.data);

export const regenerateTestCases = (projectId, feedback) =>
  api.post(`/generation/${projectId}/regenerate`, { feedback }).then((r) => r.data);

// ── Workflows ─────────────────────────────────────────────
export const getWorkflows = (projectId) =>
  api.get(`/workflows/${projectId}`).then((r) => r.data.data);

export const approveWorkflow = (id) =>
  api.patch(`/workflows/${id}/approve`).then((r) => r.data.data);

export const approveAllWorkflows = (projectId) =>
  api.post('/workflows/approve-all', { projectId }).then((r) => r.data.data);

export const deleteWorkflow = (id) =>
  api.delete(`/workflows/${id}`).then((r) => r.data);

// ── Rules ─────────────────────────────────────────────────
export const getRules = (projectId, workflowId) =>
  api
    .get(`/rules/${projectId}`, { params: workflowId ? { workflowId } : {} })
    .then((r) => r.data.data);

export const updateRule = (id, data) =>
  api.patch(`/rules/${id}`, data).then((r) => r.data.data);

export const approveRule = (id) =>
  api.patch(`/rules/${id}/approve`).then((r) => r.data.data);

export const bulkApproveRules = (projectId, ids) =>
  api.post('/rules/bulk-approve', { projectId, ids }).then((r) => r.data.data);

export const bulkDeleteRules = (ids) =>
  api.delete('/rules/bulk-delete', { data: { ids } }).then((r) => r.data);

export const deleteRule = (id) =>
  api.delete(`/rules/${id}`).then((r) => r.data);

// ── User Stories ──────────────────────────────────────────
export const getUserStories = (projectId, workflowId) =>
  api
    .get(`/user-stories/${projectId}`, { params: workflowId ? { workflowId } : {} })
    .then((r) => r.data.data);

export const updateUserStory = (id, data) =>
  api.patch(`/user-stories/${id}`, data).then((r) => r.data.data);

export const approveUserStory = (id) =>
  api.patch(`/user-stories/${id}/approve`).then((r) => r.data.data);

export const bulkApproveUserStories = (projectId, ids) =>
  api.post('/user-stories/bulk-approve', { projectId, ids }).then((r) => r.data.data);

// ── Test Cases ────────────────────────────────────────────
export const getTestCases = (projectId, workflowId) =>
  api
    .get(`/test-cases/${projectId}`, { params: workflowId ? { workflowId } : {} })
    .then((r) => r.data.data);

export const updateTestCase = (id, data) =>
  api.patch(`/test-cases/${id}`, data).then((r) => r.data.data);

export const approveTestCase = (id) =>
  api.patch(`/test-cases/${id}/approve`).then((r) => r.data.data);

export const bulkApproveTestCases = (projectId, ids) =>
  api.post('/test-cases/bulk-approve', { projectId, ids }).then((r) => r.data.data);

export const bulkDeleteTestCases = (ids) =>
  api.delete('/test-cases/bulk-delete', { data: { ids } }).then((r) => r.data);

// ── Export ────────────────────────────────────────────────
export const exportTestCasesJSON = (projectId) =>
  api
    .post(`/export/${projectId}/json`, {}, { responseType: 'blob' })
    .then((r) => r.data);

export const exportTestCasesCSV = (projectId) =>
  api
    .post(`/export/${projectId}/csv`, {}, { responseType: 'blob' })
    .then((r) => r.data);

export default api;

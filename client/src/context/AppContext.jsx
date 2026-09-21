import React, { createContext, useContext, useReducer, useCallback } from 'react';

export const STEPS = {
  WELCOME: 'WELCOME',
  PROJECT_NAME: 'PROJECT_NAME',
  CONTEXT_UPLOAD: 'CONTEXT_UPLOAD',
  GENERATION_OPTIONS: 'GENERATION_OPTIONS',
  REVIEWING_WORKFLOWS: 'REVIEWING_WORKFLOWS',
  REVIEWING_RULES: 'REVIEWING_RULES',
  REVIEWING_USER_STORIES: 'REVIEWING_USER_STORIES',
  REVIEWING_TEST_CASES: 'REVIEWING_TEST_CASES',
  EXPORT: 'EXPORT',
};

const initialState = {
  step: STEPS.WELCOME,
  messages: [],
  project: null,
  workflows: [],
  rules: [],
  userStories: [],
  testCases: [],
  loading: false,
  error: null,
};

const ACTION = {
  SET_STEP: 'SET_STEP',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_PROJECT: 'SET_PROJECT',
  SET_WORKFLOWS: 'SET_WORKFLOWS',
  SET_RULES: 'SET_RULES',
  SET_USER_STORIES: 'SET_USER_STORIES',
  SET_TEST_CASES: 'SET_TEST_CASES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_WORKFLOW: 'UPDATE_WORKFLOW',
  UPDATE_RULE: 'UPDATE_RULE',
  UPDATE_USER_STORY: 'UPDATE_USER_STORY',
  UPDATE_TEST_CASE: 'UPDATE_TEST_CASE',
  REMOVE_RULE: 'REMOVE_RULE',
  REMOVE_TEST_CASE: 'REMOVE_TEST_CASE',
  RESET: 'RESET',
  LOAD_PROJECT: 'LOAD_PROJECT',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION.SET_STEP:
      return { ...state, step: action.payload };
    case ACTION.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case ACTION.SET_PROJECT:
      return { ...state, project: action.payload };
    case ACTION.SET_WORKFLOWS:
      return { ...state, workflows: action.payload };
    case ACTION.SET_RULES:
      return { ...state, rules: action.payload };
    case ACTION.SET_USER_STORIES:
      return { ...state, userStories: action.payload };
    case ACTION.SET_TEST_CASES:
      return { ...state, testCases: action.payload };
    case ACTION.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTION.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTION.UPDATE_WORKFLOW:
      return {
        ...state,
        workflows: state.workflows.map((w) =>
          w._id === action.payload._id ? action.payload : w
        ),
      };
    case ACTION.UPDATE_RULE:
      return {
        ...state,
        rules: state.rules.map((r) => (r._id === action.payload._id ? action.payload : r)),
      };
    case ACTION.UPDATE_USER_STORY:
      return {
        ...state,
        userStories: state.userStories.map((s) =>
          s._id === action.payload._id ? action.payload : s
        ),
      };
    case ACTION.UPDATE_TEST_CASE:
      return {
        ...state,
        testCases: state.testCases.map((tc) =>
          tc._id === action.payload._id ? action.payload : tc
        ),
      };
    case ACTION.REMOVE_RULE:
      return {
        ...state,
        rules: state.rules.filter((r) => !action.payload.includes(r._id)),
      };
    case ACTION.REMOVE_TEST_CASE:
      return {
        ...state,
        testCases: state.testCases.filter((tc) => !action.payload.includes(tc._id)),
      };
    case ACTION.RESET:
      return { ...initialState };
    // Restore full project state from DB (used when resuming a saved project)
    case ACTION.LOAD_PROJECT:
      return {
        ...state,
        project: action.payload.project,
        workflows: action.payload.workflows,
        rules: action.payload.rules,
        userStories: action.payload.userStories,
        testCases: action.payload.testCases,
        step: action.payload.step,
        messages: [],
        error: null,
      };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setStep = useCallback((step) => dispatch({ type: ACTION.SET_STEP, payload: step }), []);

  const addMessage = useCallback(
    (role, content, component = null) =>
      dispatch({ type: ACTION.ADD_MESSAGE, payload: { id: Date.now(), role, content, component } }),
    []
  );

  const setProject = useCallback(
    (project) => dispatch({ type: ACTION.SET_PROJECT, payload: project }),
    []
  );
  const setWorkflows = useCallback(
    (workflows) => dispatch({ type: ACTION.SET_WORKFLOWS, payload: workflows }),
    []
  );
  const setRules = useCallback(
    (rules) => dispatch({ type: ACTION.SET_RULES, payload: rules }),
    []
  );
  const setUserStories = useCallback(
    (stories) => dispatch({ type: ACTION.SET_USER_STORIES, payload: stories }),
    []
  );
  const setTestCases = useCallback(
    (tcs) => dispatch({ type: ACTION.SET_TEST_CASES, payload: tcs }),
    []
  );
  const setLoading = useCallback(
    (val) => dispatch({ type: ACTION.SET_LOADING, payload: val }),
    []
  );
  const setError = useCallback(
    (val) => dispatch({ type: ACTION.SET_ERROR, payload: val }),
    []
  );
  const updateWorkflow = useCallback(
    (wf) => dispatch({ type: ACTION.UPDATE_WORKFLOW, payload: wf }),
    []
  );
  const updateRule = useCallback(
    (rule) => dispatch({ type: ACTION.UPDATE_RULE, payload: rule }),
    []
  );
  const updateUserStory = useCallback(
    (story) => dispatch({ type: ACTION.UPDATE_USER_STORY, payload: story }),
    []
  );
  const updateTestCase = useCallback(
    (tc) => dispatch({ type: ACTION.UPDATE_TEST_CASE, payload: tc }),
    []
  );
  const removeRules = useCallback(
    (ids) => dispatch({ type: ACTION.REMOVE_RULE, payload: ids }),
    []
  );
  const removeTestCases = useCallback(
    (ids) => dispatch({ type: ACTION.REMOVE_TEST_CASE, payload: ids }),
    []
  );

  const reset = useCallback(() => dispatch({ type: ACTION.RESET }), []);

  const loadProject = useCallback(
    (project, workflows, rules, userStories, testCases, step) =>
      dispatch({
        type: ACTION.LOAD_PROJECT,
        payload: { project, workflows, rules, userStories, testCases, step },
      }),
    []
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        setStep,
        addMessage,
        setProject,
        setWorkflows,
        setRules,
        setUserStories,
        setTestCases,
        setLoading,
        setError,
        updateWorkflow,
        updateRule,
        updateUserStory,
        updateTestCase,
        removeRules,
        removeTestCases,
        reset,
        loadProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

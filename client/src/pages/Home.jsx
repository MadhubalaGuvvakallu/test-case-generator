import React, { useEffect } from 'react';
import { useAppContext, STEPS } from '../context/AppContext.jsx';

// Chat
import ChatWindow from '../components/chat/ChatWindow.jsx';

// Project
import ProjectCard from '../components/project/ProjectCard.jsx';
import ProjectNameInput from '../components/project/ProjectNameInput.jsx';
import AssociateContext from '../components/project/AssociateContext.jsx';

// Generation
import TestDesignOptimization from '../components/generation/TestDesignOptimization.jsx';
import GeneratedWorkflows from '../components/generation/GeneratedWorkflows.jsx';
import GeneratedRules from '../components/generation/GeneratedRules.jsx';
import GeneratedUserStories from '../components/generation/GeneratedUserStories.jsx';
import GeneratedTestCases from '../components/generation/GeneratedTestCases.jsx';

// Export
import ExportTestCases from '../components/export/ExportTestCases.jsx';

// Welcome icon
import { RiRobotLine } from 'react-icons/ri';

const WELCOME_MESSAGE = {
  id: 'welcome-init',
  role: 'ai',
  content: "Welcome to the world of Test Case Generation. What would you like to do today?",
  component: null,
};

/**
 * Inline panels rendered inside the chat stream as message components.
 * Home wires together the chat flow state machine and injects panel components
 * as message components at the right moments.
 */
export default function Home() {
  const { step, messages, addMessage, project } = useAppContext();

  // Seed the welcome message exactly once — using a ref so React StrictMode's
  // double-mount in development does not add the message twice.
  const welcomeSentRef = React.useRef(false);
  useEffect(() => {
    if (!welcomeSentRef.current) {
      welcomeSentRef.current = true;
      addMessage('ai', WELCOME_MESSAGE.content);
    }
  }, [addMessage]);

  // Inject step-specific panel components into the chat as the flow advances.
  // We track which panels have already been injected using a ref.
  const injectedRef = React.useRef(new Set());

  useEffect(() => {
    if (step === STEPS.PROJECT_NAME && !injectedRef.current.has(step)) {
      injectedRef.current.add(step);
      addMessage('ai', null, <ProjectNameInput />);
    }
    if (step === STEPS.CONTEXT_UPLOAD && project && !injectedRef.current.has(step)) {
      injectedRef.current.add(step);
      addMessage('ai', null, <ProjectCard project={project} />);
      addMessage('ai', null, <AssociateContext />);
    }
    if (step === STEPS.GENERATION_OPTIONS && !injectedRef.current.has(step)) {
      injectedRef.current.add(step);
      addMessage('ai', null, <TestDesignOptimization />);
    }
    if (step === STEPS.REVIEWING_WORKFLOWS && !injectedRef.current.has(step)) {
      injectedRef.current.add(step);
      addMessage('ai', null, <GeneratedWorkflows />);
    }
    if (step === STEPS.REVIEWING_RULES && !injectedRef.current.has(step)) {
      injectedRef.current.add(step);
      addMessage('ai', null, <GeneratedRules />);
    }
    if (step === STEPS.REVIEWING_USER_STORIES && !injectedRef.current.has(step)) {
      injectedRef.current.add(step);
      addMessage('ai', null, <GeneratedUserStories />);
    }
    if (step === STEPS.REVIEWING_TEST_CASES && !injectedRef.current.has(step)) {
      injectedRef.current.add(step);
      addMessage('ai', null, <GeneratedTestCases />);
    }
    if (step === STEPS.EXPORT && !injectedRef.current.has(step)) {
      injectedRef.current.add(step);
      addMessage('ai', null, <ExportTestCases />);
    }
  }, [step, project, addMessage]);

  return (
    <div className="home-page">
      {/* Welcome hero — only visible when at WELCOME step with no messages yet shown */}
      {step === STEPS.WELCOME && messages.length <= 1 && (
        <div className="welcome-hero">
          <div className="welcome-icon">
            <RiRobotLine size={48} />
          </div>
          <h1 className="welcome-title">MELO</h1>
          <p className="welcome-subtitle">AI-powered Test Case Generation</p>
        </div>
      )}
      <ChatWindow />
    </div>
  );
}

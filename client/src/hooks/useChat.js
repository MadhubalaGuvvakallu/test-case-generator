import { useCallback } from 'react';
import { useAppContext, STEPS } from '../context/AppContext.jsx';

export function useChat() {
  const { messages, addMessage, setStep, setLoading, setError } = useAppContext();

  const sendAIMessage = useCallback(
    (content, component = null) => {
      addMessage('ai', content, component);
    },
    [addMessage]
  );

  const sendUserMessage = useCallback(
    (content) => {
      addMessage('user', content);
    },
    [addMessage]
  );

  const startProjectFlow = useCallback(() => {
    setStep(STEPS.PROJECT_NAME);
    sendAIMessage(
      "I'm creating a new project for test case generation. Please enter a name for your project."
    );
  }, [setStep, sendAIMessage]);

  return { messages, sendAIMessage, sendUserMessage, startProjectFlow };
}

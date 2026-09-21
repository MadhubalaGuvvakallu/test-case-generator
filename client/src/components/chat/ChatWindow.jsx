import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import { useChat } from '../../hooks/useChat.js';

export default function ChatWindow() {
  const { messages, loading } = useAppContext();
  const { sendUserMessage, startProjectFlow } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    sendUserMessage(text);
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="chat-typing">
            <div className="chat-avatar chat-avatar--ai">AI</div>
            <div className="chat-typing-dots">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={handleSend} onNewProject={startProjectFlow} />
    </div>
  );
}

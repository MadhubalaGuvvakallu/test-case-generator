import React from 'react';

export default function ChatMessage({ message }) {
  const isAI = message.role === 'ai';

  // Minimal markdown renderer: bold (**text**) and newlines
  const renderContent = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`chat-message chat-message--${message.role}`}>
      {isAI && <div className="chat-avatar chat-avatar--ai">AI</div>}
      <div className="chat-bubble-wrapper">
        {message.content && (
          <div className={`chat-bubble chat-bubble--${message.role}`}>
            {renderContent(message.content)}
          </div>
        )}
        {message.component && (
          <div className="chat-component">{message.component}</div>
        )}
      </div>
    </div>
  );
}

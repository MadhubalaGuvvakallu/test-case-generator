import React, { useState, useRef } from 'react';
import { RiAttachment2, RiMicLine, RiSendPlaneFill } from 'react-icons/ri';

export default function ChatInput({ onSend, onNewProject }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Check for "new project" intent
    if (/new project/i.test(trimmed)) {
      onNewProject?.();
    } else {
      onSend?.(trimmed);
    }
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-bar">
      <button className="chat-input-btn" title="Attach file" type="button">
        <RiAttachment2 size={20} />
      </button>
      <input
        ref={inputRef}
        className="chat-input-field"
        type="text"
        placeholder="Ask me anything or say 'new project' to start..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="chat-input-btn" title="Voice input" type="button">
        <RiMicLine size={20} />
      </button>
      <button
        className="chat-input-send"
        title="Send"
        type="button"
        onClick={handleSend}
        disabled={!value.trim()}
      >
        <RiSendPlaneFill size={18} />
      </button>
    </div>
  );
}

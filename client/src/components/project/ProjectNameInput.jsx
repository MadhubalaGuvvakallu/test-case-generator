import React, { useState } from 'react';
import { useProject } from '../../hooks/useProject.js';
import { useAppContext } from '../../context/AppContext.jsx';

export default function ProjectNameInput() {
  const [name, setName] = useState('');
  const { createProject } = useProject();
  const { loading } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    await createProject(name.trim());
  };

  return (
    <form className="project-name-form" onSubmit={handleSubmit}>
      <input
        className="project-name-input"
        type="text"
        placeholder="Enter Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        autoFocus
      />
      <button
        className="btn btn--primary"
        type="submit"
        disabled={!name.trim() || loading}
      >
        {loading ? 'Creating...' : 'Continue'}
      </button>
    </form>
  );
}

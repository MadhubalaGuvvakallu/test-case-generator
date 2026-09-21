import React, { useState } from 'react';
import { useGeneration } from '../../hooks/useGeneration.js';
import { useAppContext } from '../../context/AppContext.jsx';

const CATEGORIES = ['Functional', 'Non-Functional', 'Integration', 'Regression', 'Smoke'];
const TECHNIQUES = ['Equivalence Partitioning', 'Boundary Value Analysis', 'Decision Table', 'State Transition', 'Use Case Testing'];
const OUTPUTS = ['Testcase', 'User Stories'];

export default function TestDesignOptimization({ onCancel }) {
  const [format, setFormat] = useState('standard');
  const [category, setCategory] = useState('');
  const [technique, setTechnique] = useState('');
  const [outputs, setOutputs] = useState(['Testcase', 'User Stories']);
  const { generate } = useGeneration();
  const { loading } = useAppContext();

  const toggleOutput = (o) => {
    setOutputs((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]
    );
  };

  const handleGenerate = async () => {
    await generate({ format, category, technique, outputs });
  };

  return (
    <div className="test-design-panel">
      {/* Output selection chips */}
      <div className="panel-section">
        <label className="panel-label">Choose the output you'd like to generate:</label>
        <div className="chip-row">
          <span className="chip-prefix">Generate</span>
          {OUTPUTS.map((o) => (
            <button
              key={o}
              type="button"
              className={`chip${outputs.includes(o) ? ' chip--active' : ''}`}
              onClick={() => toggleOutput(o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-divider" />

      {/* Design Technique */}
      <div className="panel-section">
        <div className="panel-label">Design Technique Category</div>
        <div className="panel-row">
          <select
            className="panel-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="panel-select"
            value={technique}
            onChange={(e) => setTechnique(e.target.value)}
          >
            <option value="">Select Technique</option>
            {TECHNIQUES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Format */}
      <div className="panel-section">
        <div className="panel-label">Select Test Case Format</div>
        <div className="radio-group">
          {[
            { value: 'standard', label: 'Standard' },
            { value: 'bdd', label: 'BDD (Gherkin)' },
            { value: 'bdd2', label: 'BDD 2.0' },
          ].map(({ value, label }) => (
            <label key={value} className="radio-label">
              <input
                type="radio"
                name="format"
                value={value}
                checked={format === value}
                onChange={() => setFormat(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="panel-actions">
        <button className="btn btn--ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn btn--primary"
          type="button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
}

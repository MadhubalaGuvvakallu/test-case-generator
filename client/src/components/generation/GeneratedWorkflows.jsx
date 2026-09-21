import React, { useState } from 'react';
import { RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import WorkflowItem from './WorkflowItem.jsx';
import { useGeneration } from '../../hooks/useGeneration.js';
import { useAppContext } from '../../context/AppContext.jsx';

export default function GeneratedWorkflows() {
  const { workflows, approveAllWorkflows } = useGeneration();
  const { loading } = useAppContext();

  return (
    <div className="generated-panel">
      <div className="panel-header">
        <span className="panel-title">Generated Workflows ({workflows.length})</span>
        <div className="panel-header-actions">
          <button
            className="btn btn--primary btn--sm"
            type="button"
            onClick={approveAllWorkflows}
            disabled={loading}
          >
            <RiCheckboxCircleLine size={15} />
            Approve All &amp; Proceed
          </button>
        </div>
      </div>
      <div className="panel-list">
        {workflows.map((wf, i) => (
          <WorkflowItem key={wf._id} workflow={wf} index={i} />
        ))}
        {workflows.length === 0 && (
          <div className="panel-empty">No workflows generated yet.</div>
        )}
      </div>
    </div>
  );
}

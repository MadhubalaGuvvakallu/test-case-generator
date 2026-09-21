import React, { useState } from 'react';
import {
  RiArrowDownSLine, RiArrowRightSLine, RiDeleteBin6Line,
  RiCheckboxCircleLine, RiFlowChart,
} from 'react-icons/ri';
import Badge from '../common/Badge.jsx';
import { useGeneration } from '../../hooks/useGeneration.js';
import { useAppContext } from '../../context/AppContext.jsx';
import WorkflowVisualMap from './WorkflowVisualMap.jsx';
import * as api from '../../services/api.js';

export default function WorkflowItem({ workflow, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { approveWorkflow } = useGeneration();
  const { rules, userStories, testCases, setWorkflows } = useAppContext();

  const workflowRules = rules.filter((r) => r.workflowId === workflow._id);
  const workflowStories = userStories.filter((s) => s.workflowId === workflow._id);
  const workflowTests = testCases.filter((tc) => tc.workflowId === workflow._id);

  const handleApprove = async () => {
    await approveWorkflow(workflow._id);
  };

  const handleDelete = async () => {
    await api.deleteWorkflow(workflow._id);
    const updated = await api.getWorkflows(workflow.projectId);
    setWorkflows(updated);
  };

  return (
    <>
      <div className={`workflow-row${expanded ? ' workflow-row--expanded' : ''}`}>
        <button
          className="workflow-expand-btn"
          type="button"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? <RiArrowDownSLine size={18} /> : <RiArrowRightSLine size={18} />}
        </button>
        <div className="workflow-info">
          <span className="workflow-number">#{index + 1}</span>
          <span className="workflow-name">{workflow.name}</span>
          <span className="workflow-desc">{workflow.description}</span>
        </div>
        <div className="workflow-meta">
          <span className="workflow-stat">{workflow.rulesCount} rules</span>
          <span className="workflow-stat">{workflow.userStoriesCount} stories</span>
          <span className="workflow-stat">{workflow.testCasesCount} tests</span>
          <Badge status={workflow.status} />
        </div>
        <div className="workflow-actions">
          <button
            className="icon-btn"
            title="View visual map"
            type="button"
            onClick={() => setShowMap(true)}
          >
            <RiFlowChart size={16} />
          </button>
          <button
            className="icon-btn icon-btn--success"
            title="Approve"
            type="button"
            onClick={handleApprove}
            disabled={workflow.status === 'approved'}
          >
            <RiCheckboxCircleLine size={16} />
          </button>
          <button
            className="icon-btn icon-btn--danger"
            title="Delete"
            type="button"
            onClick={handleDelete}
          >
            <RiDeleteBin6Line size={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="workflow-detail">
          {workflowRules.length > 0 && (
            <div className="workflow-detail-section">
              <div className="workflow-detail-heading">{workflowRules.length} Rules</div>
              {workflowRules.slice(0, 5).map((r) => (
                <div key={r._id} className="workflow-detail-item">
                  <span>{r.text}</span>
                  {r.tags?.map((tag) => <Badge key={tag} label={tag} variant="tag" />)}
                </div>
              ))}
              {workflowRules.length > 5 && (
                <div className="workflow-detail-more">+{workflowRules.length - 5} more rules</div>
              )}
            </div>
          )}
          {workflowStories.length > 0 && (
            <div className="workflow-detail-section">
              <div className="workflow-detail-heading">{workflowStories.length} User Stories</div>
              {workflowStories.slice(0, 3).map((s) => (
                <div key={s._id} className="workflow-detail-item">{s.title}</div>
              ))}
            </div>
          )}
          {workflowTests.length > 0 && (
            <div className="workflow-detail-section">
              <div className="workflow-detail-heading">{workflowTests.length} Test Cases</div>
              {workflowTests.slice(0, 3).map((tc) => (
                <div key={tc._id} className="workflow-detail-item">{tc.title}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {showMap && (
        <WorkflowVisualMap
          workflow={workflow}
          onClose={() => setShowMap(false)}
          onApprove={async () => { await handleApprove(); setShowMap(false); }}
        />
      )}
    </>
  );
}

import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowRightSLine, RiCheckboxCircleLine } from 'react-icons/ri';
import Badge from '../common/Badge.jsx';
import { useGeneration } from '../../hooks/useGeneration.js';
import { useAppContext } from '../../context/AppContext.jsx';

export default function GeneratedUserStories() {
  const { userStories, bulkApproveUserStories, approveAllUserStories } = useGeneration();
  const { loading } = useAppContext();
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // Group by workflowId
  const grouped = userStories.reduce((acc, story) => {
    const key = story.workflowId || 'ungrouped';
    if (!acc[key]) acc[key] = [];
    acc[key].push(story);
    return acc;
  }, {});

  return (
    <div className="generated-panel">
      <div className="panel-header">
        <span className="panel-title">Generated User Stories ({userStories.length})</span>
        <button
          className="btn btn--primary btn--sm"
          type="button"
          onClick={approveAllUserStories}
          disabled={loading}
        >
          Approve All &amp; Proceed
        </button>
      </div>

      <div className="panel-list">
        {Object.entries(grouped).map(([wfId, stories]) => (
          <div key={wfId} className="story-group">
            <div className="story-group-header">
              User Stories — Workflow ({stories.length})
            </div>
            {stories.map((story) => (
              <div key={story._id} className="story-row">
                <button
                  className="icon-btn"
                  type="button"
                  onClick={() => toggleExpand(story._id)}
                >
                  {expanded[story._id]
                    ? <RiArrowDownSLine size={16} />
                    : <RiArrowRightSLine size={16} />}
                </button>
                <div className="story-content">
                  <div className="story-title">{story.title}</div>
                  {expanded[story._id] && (
                    <div className="story-detail">
                      <p className="story-description">{story.description}</p>
                      {story.acceptanceCriteria?.length > 0 && (
                        <div className="story-criteria">
                          <strong>Acceptance Criteria:</strong>
                          <ul>
                            {story.acceptanceCriteria.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="story-tags">
                  {(story.tags || []).map((tag) => <Badge key={tag} label={tag} variant="tag" />)}
                  <Badge status={story.status} />
                </div>
                <button
                  className="icon-btn icon-btn--success"
                  type="button"
                  title="Approve"
                  disabled={story.status === 'approved'}
                  onClick={async () => {
                    const { approveUserStory } = await import('../../services/api.js');
                    // handled via bulk in parent; individual approve via API directly
                  }}
                >
                  <RiCheckboxCircleLine size={16} />
                </button>
              </div>
            ))}
          </div>
        ))}
        {userStories.length === 0 && <div className="panel-empty">No user stories found.</div>}
      </div>
    </div>
  );
}

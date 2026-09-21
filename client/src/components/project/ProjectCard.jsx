import React from 'react';
import { RiHeartPulseLine, RiTestTubeLine, RiTimeLine } from 'react-icons/ri';

export default function ProjectCard({ project }) {
  const updatedDate = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-card-name">{project.name.toUpperCase()}</div>
        <span className={`badge badge--${project.status}`}>{project.status}</span>
      </div>
      <div className="project-card-stats">
        <div className="project-stat">
          <RiHeartPulseLine size={16} className="project-stat-icon project-stat-icon--health" />
          <div>
            <div className="project-stat-value">{project.healthScore}<span className="project-stat-max">/10</span></div>
            <div className="project-stat-label">Health Score</div>
          </div>
        </div>
        <div className="project-stat">
          <RiTestTubeLine size={16} className="project-stat-icon project-stat-icon--tests" />
          <div>
            <div className="project-stat-value">{project.totalTestCases}</div>
            <div className="project-stat-label">Test Cases</div>
          </div>
        </div>
        <div className="project-stat">
          <RiTimeLine size={16} className="project-stat-icon project-stat-icon--time" />
          <div>
            <div className="project-stat-value project-stat-value--sm">{updatedDate}</div>
            <div className="project-stat-label">Last Updated</div>
          </div>
        </div>
      </div>
    </div>
  );
}

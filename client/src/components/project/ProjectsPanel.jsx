import React, { useEffect, useState, useCallback } from 'react';
import { RiRefreshLine, RiArchiveLine, RiFolderOpenLine, RiAddLine } from 'react-icons/ri';
import { getAllProjects, archiveProject } from '../../services/api.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { useLoadProject } from '../../hooks/useLoadProject.js';

export default function ProjectsPanel({ onClose }) {
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { reset, loading } = useAppContext();
  const { resumeProject } = useLoadProject();

  const fetchProjects = useCallback(async () => {
    setFetching(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch {
      // silently ignore — panel is non-critical
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleResume = async (projectId) => {
    onClose();
    await resumeProject(projectId);
  };

  const handleNew = () => {
    reset();
    onClose();
  };

  const handleArchive = async (e, projectId) => {
    e.stopPropagation();
    try {
      await archiveProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch {
      // ignore
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="projects-panel">
      <div className="projects-panel__header">
        <span className="projects-panel__title">Saved Projects</span>
        <div className="projects-panel__actions">
          <button className="projects-panel__icon-btn" title="Refresh" onClick={fetchProjects}>
            <RiRefreshLine size={15} />
          </button>
          <button className="projects-panel__new-btn" onClick={handleNew} title="New project">
            <RiAddLine size={14} /> New
          </button>
        </div>
      </div>

      <div className="projects-panel__list">
        {fetching && <p className="projects-panel__empty">Loading…</p>}
        {!fetching && projects.length === 0 && (
          <p className="projects-panel__empty">No saved projects yet.</p>
        )}
        {!fetching &&
          projects.map((p) => (
            <button
              key={p._id}
              className="projects-panel__item"
              onClick={() => handleResume(p._id)}
              disabled={loading}
              title={`Resume ${p.name}`}
            >
              <div className="projects-panel__item-icon">
                <RiFolderOpenLine size={16} />
              </div>
              <div className="projects-panel__item-body">
                <span className="projects-panel__item-name">{p.name}</span>
                <span className="projects-panel__item-meta">
                  {p.totalTestCases ?? 0} test cases · {formatDate(p.createdAt)}
                </span>
              </div>
              <button
                className="projects-panel__archive-btn"
                title="Archive project"
                onClick={(e) => handleArchive(e, p._id)}
              >
                <RiArchiveLine size={14} />
              </button>
            </button>
          ))}
      </div>
    </div>
  );
}

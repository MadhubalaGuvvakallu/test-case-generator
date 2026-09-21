import React, { useState } from 'react';
import {
  RiMenuLine,
  RiSearchLine,
  RiCalendarLine,
  RiBellLine,
  RiStackLine,
  RiSettings3Line,
  RiApps2Line,
  RiFileTextLine,
  RiTableLine,
  RiCloseLine,
} from 'react-icons/ri';
import ProjectsPanel from '../project/ProjectsPanel.jsx';

export default function Sidebar() {
  const [panelOpen, setPanelOpen] = useState(false);

  const navItems = [
    { icon: RiMenuLine, title: 'Menu' },
    { icon: RiSearchLine, title: 'Search' },
    { icon: RiCalendarLine, title: 'Calendar' },
    { icon: RiBellLine, title: 'Notifications' },
    {
      icon: RiStackLine,
      title: 'Projects',
      onClick: () => setPanelOpen((o) => !o),
      active: panelOpen,
    },
    { icon: RiSettings3Line, title: 'Settings' },
    { icon: RiApps2Line, title: 'Dashboard' },
    { icon: RiFileTextLine, title: 'Documents' },
    { icon: RiTableLine, title: 'Test Cases' },
  ];

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">M</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ icon: Icon, title, active, onClick }) => (
            <button
              key={title}
              className={`sidebar-nav-item${active ? ' sidebar-nav-item--active' : ''}`}
              title={title}
              type="button"
              onClick={onClick}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-avatar" title="Madhubala">MB</div>
        </div>
      </aside>

      {panelOpen && (
        <div className="projects-panel-overlay">
          <button
            className="projects-panel-overlay__close"
            onClick={() => setPanelOpen(false)}
            title="Close"
          >
            <RiCloseLine size={18} />
          </button>
          <ProjectsPanel onClose={() => setPanelOpen(false)} />
        </div>
      )}
    </>
  );
}

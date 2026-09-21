import React from 'react';
import { RiHeartLine, RiBellLine, RiArrowDownSLine } from 'react-icons/ri';

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo">MELO</span>
        <span className="topbar-tagline">Test Case Generation</span>
      </div>
      <div className="topbar-actions">
        <button className="topbar-icon-btn" title="Favourites" type="button">
          <RiHeartLine size={20} />
        </button>
        <button className="topbar-icon-btn" title="Notifications" type="button">
          <RiBellLine size={20} />
        </button>
        <div className="topbar-user">
          <div className="topbar-avatar">MB</div>
          <span className="topbar-username">Madhubala</span>
          <RiArrowDownSLine size={16} />
        </div>
      </div>
    </header>
  );
}

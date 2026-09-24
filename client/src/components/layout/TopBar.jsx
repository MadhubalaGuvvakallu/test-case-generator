import React from 'react';
import { RiHeartLine, RiBellLine, RiArrowDownSLine, RiLogoutBoxLine } from 'react-icons/ri';
import { useAppContext } from '../../context/AppContext.jsx';

export default function TopBar() {
  const { authUser, logout } = useAppContext();

  const initials = authUser?.name
    ? authUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'MB';

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
          <div className="topbar-avatar">{initials}</div>
          <span className="topbar-username">{authUser?.name || 'Madhubala'}</span>
          <RiArrowDownSLine size={16} />
        </div>
        <button
          className="topbar-icon-btn topbar-logout-btn"
          title="Logout"
          type="button"
          onClick={logout}
        >
          <RiLogoutBoxLine size={20} />
        </button>
      </div>
    </header>
  );
}

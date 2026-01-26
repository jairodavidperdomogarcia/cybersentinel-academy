import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

function Layout() {
  return (
    <div className="app-container">
      <header className="main-header">
        <div className="logo-section">
          <div className="logo-icon">🛡️</div>
          <h1>CYBERSENTINEL <span className="highlight">STRATEGIC HUB</span></h1>
        </div>
        <nav className="main-nav">
          <Link to="/" className="nav-item">DASHBOARD</Link>
          <div className="external-links" style={{ display: 'flex', gap: '15px', marginLeft: '20px', borderLeft: '1px solid #333', paddingLeft: '20px', alignItems: 'center' }}>
            <button
              onClick={() => window.close()}
              style={{
                background: 'rgba(255, 51, 102, 0.1)',
                border: '1px solid #ff3366',
                color: '#ff3366',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                marginRight: '10px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 51, 102, 0.3)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 51, 102, 0.1)'; }}
            >
              ✕ EXIT
            </button>
            <a href="/cmd-center/index.html" target="_blank" rel="noopener noreferrer" className="nav-item external">CMD CENTER</a>
            <a href="http://localhost:3007" target="_blank" rel="noopener noreferrer" className="nav-item external">DOME (V3)</a>
            <a href="http://localhost:3008" target="_blank" rel="noopener noreferrer" className="nav-item external">WAR ROOM (V4)</a>
          </div>
        </nav>
      </header>
      <main className="content-area">
        <Outlet />
      </main>
      <footer className="main-footer">
        <p>CyberSentinel Strategic Hub v2.0 // Authorized Personnel Only</p>
      </footer>
    </div>
  );
}

export default Layout;
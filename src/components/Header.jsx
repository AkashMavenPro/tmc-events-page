import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header className="app-header">
      <nav>
        <button
          className={activeTab === 'pastEvents' ? 'active' : ''}
          onClick={() => setActiveTab('pastEvents')}
        >
          Past Events
        </button>
        <button
          className={activeTab === 'leadersVideo' ? 'active' : ''}
          onClick={() => setActiveTab('leadersVideo')}
        >
          Leaders Video
        </button>
      </nav>
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { Home, Search, Flame, FileText } from 'lucide-react';

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
      ${isActive 
        ? 'bg-white/10 backdrop-blur-sm text-white font-semibold' 
        : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const LeftSideBar = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <nav className="fixed left-0  h-screen w-64 bg-gradient-to-b from-blue-600 via-violet-600 to-white p-6 shadow-2xl
      transform transition-transform duration-300 lg:translate-x-0
      -translate-x-full sm:translate-x-0">
      <div className="flex flex-col h-full">
        <div className="space-y-2">
          <NavItem
            icon={<Home size={20} />}
            label="Home"
            isActive={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavItem
            icon={<Search size={20} />}
            label="Explore"
            isActive={activeTab === 'explore'}
            onClick={() => setActiveTab('explore')}
          />
          <NavItem
            icon={<Flame size={20} />}
            label="Trending"
            isActive={activeTab === 'trending'}
            onClick={() => setActiveTab('trending')}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="All Posts"
            isActive={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          />
        </div>
      </div>
    </nav>
  );
};

export default LeftSideBar;

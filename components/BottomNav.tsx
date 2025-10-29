import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Compass, Sparkles } from 'lucide-react';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const activeClass = 'text-yellow-400';
  const inactiveClass = 'text-gray-400';

  return (
    <NavLink to={to} className={({ isActive }) => `flex flex-col items-center justify-center space-y-1 ${isActive ? activeClass : inactiveClass}`}>
      {icon}
      <span className="text-xs">{label}</span>
    </NavLink>
  );
};

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-2 flex justify-around items-center h-16">
      <NavItem to="/" icon={<Home size={24} />} label="Home" />
      <NavItem to="/read" icon={<BookOpen size={24} />} label="Read" />
      <NavItem to="/search" icon={<Compass size={24} />} label="Explore" />
      <NavItem to="/assistant" icon={<Sparkles size={24} />} label="Assistant" />
    </nav>
  );
};

export default BottomNav;

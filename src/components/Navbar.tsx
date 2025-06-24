import React from 'react';
import { useAuth } from '../auth/AuthContext';

interface NavbarProps {
  title: string;
  showConvertButton?: boolean;
  showHistoryButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  title, 
  showConvertButton = false, 
  showHistoryButton = false 
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      <div className="flex-none gap-2">
        {/* Navigation Buttons */}
        {showConvertButton && (
          <a href="/convert" className="btn btn-primary btn-sm">
            Convert Currency
          </a>
        )}
        
        {showHistoryButton && (
          <a href="/conversions" className="btn btn-outline btn-sm">
            View History
          </a>
        )}
        
        {/* User Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
                {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <div className="text-sm opacity-70">
                {user?.full_name || user?.email}
              </div>
            </li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 
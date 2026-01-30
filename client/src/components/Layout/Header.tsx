
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPackage, FiBarChart2, FiList, FiClock, FiDownload } from 'react-icons/fi';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiBarChart2 /> },
    { path: '/products', label: 'Products', icon: <FiList /> },
    { path: '/history', label: 'History', icon: <FiClock /> },
    { path: '/export', label: 'Export', icon: <FiDownload /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-pink-50 to-rose-200 border-b border-pink-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-pink-500 p-2 rounded-lg">
              <FiPackage className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">InventoryPro</h1>
              <p className="text-sm text-gray-600">By Anusha Singh</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-pink-200 text-pink-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Stats Badge */}
          <div className="mt-4 md:mt-0">
            <div className="bg-pink-50 text-pink-700 px-4 py-2 rounded-lg border border-pink-200">
              <div className="text-sm font-medium"></div>
              <div className="text-xs">Inventory updated in real-time!</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
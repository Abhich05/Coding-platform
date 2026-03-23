import React from 'react';
import { Search, Bell, User, ChevronDown, Home, BookOpen, Trophy, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Platform Name */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">CodePlatform</h1>
            </div>
            
            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="flex items-center space-x-2 text-blue-600 font-semibold">
                <Home size={20} />
                <span>Platform</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Trophy size={20} />
                <span>Pro Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <BookOpen size={20} />
                <span>Practice</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Trophy size={20} />
                <span>Jobs</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <UserCircle size={20} />
                <span>Profile</span>
              </a>
            </div>
          </div>

          {/* Right: Search and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search problems, tags, companies"
                className="bg-transparent border-none outline-none ml-3 w-full text-gray-700"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={22} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">JD</span>
              </div>
              <ChevronDown size={20} className="text-gray-600" />
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="mt-4 lg:hidden">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search problems, tags, companies"
              className="bg-transparent border-none outline-none ml-3 w-full text-gray-700"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
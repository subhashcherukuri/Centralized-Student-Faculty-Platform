import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X 
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}


export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#dashboard');

  React.useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash || '#dashboard');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  let navigation = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Activities', href: '#activities' },
    { name: 'Profile', href: '#portfolio' },
    { name: 'Analytics', href: '#analytics' },
  ];
  if (user?.role === 'student' || user?.role === 'admin') {
    navigation.splice(3, 0, { name: 'Academics', href: '#academics' });
  }
  if (user?.role === 'faculty' || user?.role === 'admin') {
    navigation.push({ name: 'Review', href: '#review' });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        initial={false}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Student Hub</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentHash === item.href || (currentHash === '' && item.href === '#dashboard');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4 transition-all duration-200
                    ${isActive
                      ? 'bg-blue-100 text-blue-900 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'}
                  `}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <Menu className="h-6 w-6" />
                </button>
                {title && (
                  <h1 className="ml-3 text-2xl font-bold text-gray-900">{title}</h1>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
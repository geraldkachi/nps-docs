// src/components/Sidebar.tsx
import React from 'react';
import { BookOpen, ChevronRight, FileText, Home, HelpCircle, Settings, Zap } from 'lucide-react';
import { navigationItems } from '../data/docData';

interface SidebarProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUrl, onNavigate, isOpen, onClose }) => {
  const getIcon = (title: string) => {
    if (title.includes('Welcome')) return <Home className="w-4 h-4" />;
    if (title.includes('Getting')) return <BookOpen className="w-4 h-4" />;
    if (title.includes('Test')) return <Settings className="w-4 h-4" />;
    if (title.includes('Tag')) return <FileText className="w-4 h-4" />;
    if (title.includes('FAQ')) return <HelpCircle className="w-4 h-4" />;
    if (title.includes('API')) return <Zap className="w-4 h-4" />;
    return <ChevronRight className="w-4 h-4" />;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-30
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NPS</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">NIBSS NPS</h1>
              <p className="text-xs text-gray-500">Integration Guide</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          {navigationItems.map((item) => (
            <button
              key={item.url}
              onClick={() => {
                onNavigate(item.url);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-colors duration-200
                ${currentUrl === item.url
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {getIcon(item.title)}
              <span className="flex-1 text-left">{item.title}</span>
              {currentUrl === item.url && (
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
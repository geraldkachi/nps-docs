// src/App.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MarkdownRenderer from './components/MarkdownRenderer';
import { docPages } from './data/docData';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [currentPage, setCurrentPage] = useState(docPages[0]);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [isDarkMode]);
  
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  const handleNavigate = (url: string) => {
    const page = docPages.find(p => p.url === url);
    if (page) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          currentUrl={currentPage.url}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="lg:pl-72">
          <Header
            onMenuClick={() => setIsSidebarOpen(true)}
            isDarkMode={isDarkMode}
            onDarkModeToggle={handleDarkModeToggle}
          />
          
          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-300 rounded-xl shadow-sm p-6 md:p-8">
              <MarkdownRenderer content={currentPage.markdown} />
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  const currentIndex = docPages.findIndex(p => p.url === currentPage.url);
                  if (currentIndex > 0) {
                    handleNavigate(docPages[currentIndex - 1].url);
                  }
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {docPages.findIndex(p => p.url === currentPage.url) + 1} of {docPages.length}
              </span>
              <button
                onClick={() => {
                  const currentIndex = docPages.findIndex(p => p.url === currentPage.url);
                  if (currentIndex < docPages.length - 1) {
                    handleNavigate(docPages[currentIndex + 1].url);
                  }
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Next →
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
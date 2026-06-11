import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import LoginPage from './components/login/LoginPage';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './routes/ProtectedRoute';
import TopNav from './components/TopNav';
import ChatArea from './components/ChatArea';

// Toast Notifications Setup
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // 1. Reactive states for layouts
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // 2. Automatically listen to screen resizing changes
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768; // Tailwind 'md' breakpoint threshold
      setIsMobile(mobileView);
      
      // Desktop should always display the sidebar; mobile defaults to hidden
      if (!mobileView) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false); 
      }
    };

    // Run once on mount to establish baseline layout sizing
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Layout action handlers
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebarOnMobile = () => {
    if (isMobile) setShowSidebar(false);
  };

  return (
    <HashRouter>
      {/* Global Notification Container */}
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

      <Routes>
        {/* Explicit Login Route Mapping */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Catch-all redirect: If user hits base URL, redirect to /chats */}
        <Route path="/" element={<Navigate to="/chats" replace />} />
        
        {/* General Chats Dashboard view */}
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen w-screen bg-canvas overflow-hidden">
                <TopNav onToggleSidebar={toggleSidebar} isMobile={isMobile} />
                <div className="flex-1 overflow-hidden flex relative">
                  
                  {/* Sidebar listing container panel */}
                  <div className="w-full md:w-[320px] xl:w-[360px] h-full flex-shrink-0 border-r border-border">
                    <Sidebar 
                      onClose={toggleSidebar} 
                      closeMobileSidebar={closeSidebarOnMobile} 
                    />
                  </div>

                  {/* Empty state fallback desktop panel placeholder */}
                  {!isMobile && (
                    <div className="flex-1 flex items-center justify-center bg-surface text-secondary text-sm">
                      Select a chat room to start messaging
                    </div>
                  )}

                </div>
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* Active Message Details view */}
        <Route
          path="/message/:chat_id"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen w-screen bg-canvas overflow-hidden relative">
                
                {/* Fixed App Navigation Header Bar */}
                <TopNav onToggleSidebar={toggleSidebar} isMobile={isMobile} />

                <div className="flex flex-1 overflow-hidden relative">
                  
                  {/* Backdrop Overlay layer for active mobile drawer sidebar layouts */}
                  {isMobile && showSidebar && (
                    <div 
                      className="fixed inset-0 bg-black/40 z-30 transition-opacity"
                      onClick={() => setShowSidebar(false)}
                    />
                  )}

                  {/* Responsive Sidebar Layout drawer container */}
                  <div
                    className={`
                      ${isMobile
                        ? `fixed inset-y-0 left-0 z-40 w-[280px] sm:w-[320px] pt-[56px] transform transition-transform duration-300 ease-in-out ${
                            showSidebar ? 'translate-x-0' : '-translate-x-full'
                          }`
                        : 'relative w-[320px] xl:w-[360px] flex-shrink-0'
                      }
                      bg-canvas border-r border-border h-full z-30
                    `}
                  >
                    {/* Fixed prop configurations passed downstream natively */}
                    <Sidebar 
                      onClose={toggleSidebar} 
                      closeMobileSidebar={closeSidebarOnMobile} 
                    />
                  </div>

                  {/* Active Message Thread Interface Window */}
                  <div className={`flex-1 flex min-w-0 h-full ${isMobile && showSidebar ? 'hidden' : 'block'}`}>
                    <ChatArea onToggleSidebar={toggleSidebar}/>
                  </div>

                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Global Client-side fallback fallback path redirect targeting */}
        <Route path="*" element={<Navigate to="/chats" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
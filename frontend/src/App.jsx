import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Component Layer Imports
import LoginPage from './components/login/LoginPage';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './routes/ProtectedRoute';
import TopNav from './components/TopNav';
import ChatArea from './components/ChatArea';

// Global Flash Notification Styles
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // 1. Reactive states for responsive mobile layout viewports
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // 2. Automatically sync and listen to real-time window resizing thresholds
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768; // Tailwind 'md' breakpoint rule
      setIsMobile(mobileView);
      
      // Desktop layouts lock the sidebar into view; mobile defaults to hidden
      if (!mobileView) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false); 
      }
    };

    // Calculate initial dimensions immediately on execution mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // UI Action toggle helper handlers
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebarOnMobile = () => {
    if (isMobile) setShowSidebar(false);
  };

  return (
    <BrowserRouter>
      {/* Toast Portal Container mounted once globally */}
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

      <Routes>
        {/* 1. Base URL path now lands directly on the Login view layout */}
        <Route path="/" element={<LoginPage />} />

        {/* 2. Retain explicit route registration for general navigation triggers */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Main Dashboard /chats Overview Routing Block */}
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen w-screen bg-canvas overflow-hidden">
                <TopNav onToggleSidebar={toggleSidebar} isMobile={isMobile} />
                <div className="flex-1 overflow-hidden flex relative">
                  
                  {/* Sidebar list indexing panel container */}
                  <div className="w-full md:w-[320px] xl:w-[360px] h-full flex-shrink-0 border-r border-border">
                    <Sidebar 
                      onClose={toggleSidebar} 
                      closeMobileSidebar={closeSidebarOnMobile} 
                    />
                  </div>

                  {/* Empty fallback display slot rendered on wide monitors */}
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
        
        {/* Live Conversation Dynamic Room Routing Block */}
        <Route
          path="/message/:chat_id"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen w-screen bg-canvas overflow-hidden relative">
                
                {/* Header Action Bar Wrapper */}
                <TopNav onToggleSidebar={toggleSidebar} isMobile={isMobile} />

                <div className="flex flex-1 overflow-hidden relative">
                  
                  {/* Backdrop shroud modal layer triggered on responsive layouts */}
                  {isMobile && showSidebar && (
                    <div 
                      className="fixed inset-0 bg-black/40 z-30 transition-opacity"
                      onClick={() => setShowSidebar(false)}
                    />
                  )}

                  {/* SLIDING SIDEBAR DRAWER ACTION WRAPPER */}
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
                    <Sidebar 
                      onClose={toggleSidebar} 
                      closeMobileSidebar={closeSidebarOnMobile} 
                    />
                  </div>

                  {/* CENTRAL MESSAGING CORE ENGINE INTERFACE */}
                  <div className={`flex-1 flex min-w-0 h-full ${isMobile && showSidebar ? 'hidden' : 'block'}`}>
                    <ChatArea onToggleSidebar={toggleSidebar}/>
                  </div>

                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Global wildcard pathing failure logic fallback handler */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './components/login/LoginPage';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './routes/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from './components/TopNav';
import ChatArea from './components/ChatArea';



function MainApp() {
  return (
    <>
      <LoginPage />
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </>
  );
}

function App() {
  // 1. Reactive states for layouts
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);


// const toggleSidebar = () => {
//   setShowSidebar(prevState => !prevState);
// };

  // 2. Automatically listen to screen resizing changes
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768; // Tailwind 'md' breakpoint threshold
      setIsMobile(mobileView);
      
      // Desktop should always show sidebar, mobile defaults to hidden on fresh loads
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

  // Helper helper function to close sidebar explicitly on mobile actions
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainApp />} />
        
        {/* /chats route logic */}
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen w-screen bg-canvas overflow-hidden">
                <TopNav onToggleSidebar={toggleSidebar} isMobile={isMobile} />
                <div className="flex-1 overflow-y-auto">
                  <Sidebar closeMobileSidebar={() => isMobile && setShowSidebar(false)} />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* Responsive message details layout */}
        <Route
          path="/message/:chat_id"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen w-screen bg-canvas overflow-hidden relative">
                
                {/* Passing control handlers down to top Navigation header bars */}
                <TopNav onToggleSidebar={toggleSidebar} isMobile={isMobile} />

                <div className="flex flex-1 overflow-hidden relative">
                  
                  {/* Backdrop Overlay filter layer for open mobile sidebars */}
                  {isMobile && showSidebar && (
                    <div 
                      className="fixed inset-0 bg-black/40 z-30 transition-opacity"
                      onClick={() => setShowSidebar(false)}
                    />
                  )}

                  {/* SIDEBAR WRAPPER PANEL */}
                  <div
                    className={`
                      ${isMobile
                        ? `fixed inset-y-0 left-0 z-40 w-[280px] sm:w-[320px] pt-[56px] transform transition-transform duration-300 ease-in-out ${
                            showSidebar ? 'translate-x-0' : '-translate-x-full'
                          }`
                        : 'relative w-[320px] xl:w-[360px] flex-shrink-0'
                      }
                      bg-canvas border-r border-border h-full
                    `}
                  >
                    {/* Pass click handler so tapping a chat list contact card minimizes drawer on mobile screens */}
                    <Sidebar closeMobileSidebar={() => isMobile && setShowSidebar(false)} />
                  </div>

                  {/* CHAT WINDOW INTERFACE PANEL */}
                  <div className={`flex-1 flex min-w-0 h-full ${isMobile && showSidebar ? 'hidden' : 'block'}`}>
                    <ChatArea onToggleSidebar={toggleSidebar}/>
                  </div>

                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
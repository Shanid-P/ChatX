import { useState, useEffect, useCallback } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ContactInfo from './components/ContactInfo';

export default function App() {
  const [activeChat, setActiveChat] = useState('user-1');
  const [activeTab, setActiveTab] = useState('chats');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Responsive breakpoint detection
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // On mobile, when chat is selected, hide sidebar
  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setShowSidebar(true);
      setShowContactInfo(false);
    }
  };

  const handleToggleContactInfo = () => {
    setShowContactInfo((prev) => !prev);
    if (isMobile && !showContactInfo) {
      setShowSidebar(false);
    }
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-canvas overflow-hidden">
      {/* Top Navigation */}
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay (mobile) */}
        {isMobile && showSidebar && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden animate-fade-in"
            onClick={handleCloseSidebar}
            style={{ top: 'var(--nav-height, 56px)' }}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            ${isMobile
              ? `fixed inset-y-0 left-0 z-40 w-[85%] max-w-[340px] pt-[56px] transform transition-transform duration-300 ease-out ${
                  showSidebar ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'relative w-[320px] xl:w-[360px] flex-shrink-0'
            }
            border-r border-border
          `}
        >
          <Sidebar
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
            onClose={handleCloseSidebar}
          />
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex min-w-0 ${isMobile && showSidebar ? 'hidden' : ''}`}>
          <ChatArea
            activeChatId={activeChat}
            onToggleSidebar={handleToggleSidebar}
            onToggleContactInfo={handleToggleContactInfo}
          />
        </div>

        {/* Contact Info Overlay (mobile/tablet) */}
        {showContactInfo && (isMobile || isTablet) && (
          <div
            className="fixed inset-0 bg-black/60 z-30 animate-fade-in"
            onClick={() => setShowContactInfo(false)}
            style={{ top: '56px' }}
          />
        )}

        {/* Contact Info Panel */}
        <div
          className={`
            ${isMobile || isTablet
              ? `fixed right-0 inset-y-0 z-40 w-[85%] max-w-[360px] pt-[56px] transform transition-transform duration-300 ease-out ${
                  showContactInfo ? 'translate-x-0' : 'translate-x-full'
                }`
              : `${showContactInfo ? 'w-[320px] xl:w-[360px]' : 'w-0'} flex-shrink-0 overflow-hidden transition-all duration-300 ease-out`
            }
            border-l border-border
          `}
        >
          {showContactInfo && (
            <ContactInfo
              activeChatId={activeChat}
              onClose={() => setShowContactInfo(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

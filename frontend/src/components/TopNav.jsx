export default function TopNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'chats', icon: 'fa-regular fa-comment-dots', label: 'Chats' },
    { id: 'groups', icon: 'fa-solid fa-users', label: 'Groups' },
    { id: 'contacts', icon: 'fa-regular fa-address-book', label: 'Contacts' },
    { id: 'notifications', icon: 'fa-regular fa-bell', label: 'Notifications', badge: 3 },
    { id: 'settings', icon: 'fa-solid fa-gear', label: 'Settings' },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-6 py-2 bg-surface border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
          <i className="fa-solid fa-bolt text-accent text-sm"></i>
        </div>
        <span className="text-base font-bold text-primary tracking-tight hidden sm:block">
          Chat<span className="text-accent">X</span>
        </span>
      </div>

      {/* Center Tabs */}
      <div className="flex items-center gap-1 bg-canvas rounded-2xl p-1 border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 rounded-xl transition-all duration-200 group ${activeTab === tab.id
              ? 'bg-accent/15 text-accent'
              : 'text-secondary hover:text-primary hover:bg-surface-hover'
              }`}
            title={tab.label}
          >
            <i className={`${tab.icon} text-sm`}></i>
            <span className="hidden md:inline ml-2 text-xs font-medium">{tab.label}</span>
            {tab.badge && (
              <span className="absolute -top-1 -right-1 md:relative md:top-0 md:right-0 md:ml-1.5 min-w-[16px] h-4 flex items-center justify-center bg-accent text-canvas text-[9px] font-bold rounded-full px-1">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent relative">
          <i className="fa-regular fa-moon text-sm"></i>
        </button>
        <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center cursor-pointer hover:border-accent transition-colors">
          <i className="fa-solid fa-user text-xs text-accent"></i>
        </div>
      </div>
    </nav>
  );
}

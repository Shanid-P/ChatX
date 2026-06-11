import { contacts } from '../data/mockData';

export default function ContactInfo({ activeChatId, onClose }) {
  const contact = contacts.find((c) => c.id === activeChatId);

  if (!contact) return null;

  return (
    <div className="flex flex-col h-full bg-surface animate-slide-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-primary">Contact Info</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center py-8 px-4">
          <div className="relative group">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-border group-hover:ring-accent/30 transition-all duration-300"
            />
            {contact.status === 'online' && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-online rounded-full border-3 border-surface animate-pulse-glow"></span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-primary mt-4">{contact.name}</h3>
          <p className="text-xs text-secondary mt-0.5">
            {contact.status === 'online' ? (
              <span className="text-online flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-online rounded-full"></span>
                Online
              </span>
            ) : (
              `Last seen ${contact.lastSeen}`
            )}
          </p>
        </div>

        {/* About Section */}
        <div className="px-5 py-4 border-t border-border">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-tertiary mb-2">
            About
          </h4>
          <p className="text-sm text-secondary leading-relaxed">{contact.about}</p>
        </div>

        {/* Phone Section */}
        <div className="px-5 py-4 border-t border-border">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-tertiary mb-2">
            Phone
          </h4>
          <p className="text-sm text-primary">{contact.phone}</p>
        </div>

        {/* Media, Links & Docs */}
        <div className="px-5 py-4 border-t border-border">
          <button className="w-full flex items-center justify-between group">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-tertiary group-hover:text-accent transition-colors">
              Media, Links & Docs
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-accent font-medium">12</span>
              <i className="fa-solid fa-chevron-right text-[10px] text-tertiary group-hover:text-accent transition-colors"></i>
            </div>
          </button>
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-canvas border border-border overflow-hidden hover:border-accent/30 transition-colors cursor-pointer group"
              >
                <img
                  src={`https://picsum.photos/200?random=${contact.id}-${i}`}
                  alt={`Shared media ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="px-5 py-4 border-t border-border space-y-1">
          <button className="w-full flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-surface-hover transition-colors group">
            <div className="flex items-center gap-3">
              <i className="fa-regular fa-bell text-sm text-secondary group-hover:text-accent transition-colors w-5 text-center"></i>
              <span className="text-sm text-primary">Mute notifications</span>
            </div>
            <div className="w-9 h-5 bg-canvas border border-border rounded-full relative cursor-pointer transition-colors">
              <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-tertiary rounded-full transition-all"></span>
            </div>
          </button>

          <button className="w-full flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-surface-hover transition-colors group">
            <div className="flex items-center gap-3">
              <i className="fa-regular fa-clock text-sm text-secondary group-hover:text-accent transition-colors w-5 text-center"></i>
              <span className="text-sm text-primary">Disappearing messages</span>
            </div>
            <span className="text-xs text-tertiary">Off</span>
          </button>

          <button className="w-full flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-surface-hover transition-colors group">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-lock text-sm text-secondary group-hover:text-accent transition-colors w-5 text-center"></i>
              <span className="text-sm text-primary">Encryption</span>
            </div>
            <i className="fa-solid fa-chevron-right text-[10px] text-tertiary group-hover:text-accent transition-colors"></i>
          </button>

          <button className="w-full flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-surface-hover transition-colors group">
            <div className="flex items-center gap-3">
              <i className="fa-regular fa-star text-sm text-secondary group-hover:text-accent transition-colors w-5 text-center"></i>
              <span className="text-sm text-primary">Starred messages</span>
            </div>
            <i className="fa-solid fa-chevron-right text-[10px] text-tertiary group-hover:text-accent transition-colors"></i>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="px-5 py-4 border-t border-border space-y-1 mb-4">
          <button className="w-full flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-danger/5 transition-colors group">
            <i className="fa-solid fa-ban text-sm text-danger w-5 text-center"></i>
            <span className="text-sm text-danger">Block {contact.name}</span>
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-danger/5 transition-colors group">
            <i className="fa-solid fa-flag text-sm text-danger w-5 text-center"></i>
            <span className="text-sm text-danger">Report {contact.name}</span>
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-danger/5 transition-colors group">
            <i className="fa-solid fa-trash text-sm text-danger w-5 text-center"></i>
            <span className="text-sm text-danger">Delete chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, User, BarChart2, Settings, Bell, MessageSquare } from 'lucide-react';

const NavBubble = ({ to, icon: Icon }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => 
      `bubble-base w-[60px] h-[60px] ${isActive ? 'bg-primary text-white border-primary scale-110 shadow-[0_10px_25px_rgba(168,85,247,0.4)]' : 'text-primary hover:bg-primary/15'}`
    }
  >
    {({ isActive }) => <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />}
  </NavLink>
);

export default function MainLayout() {
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);

  const getTitle = () => {
    switch(location.pathname) {
      case '/': return 'Style Feed';
      case '/explore': return 'EXPLORE';
      case '/create': return 'CREATE';
      case '/messages': return 'MESSAGES';
      case '/profile': return 'PROFILE';
      case '/analytics': return 'ANALYTICS';
      case '/settings': return 'SETTINGS';
      default: return 'STYLE APP';
    }
  };

  return (
    <div className="flex w-screen h-screen bg-[#fcfcfc] text-primary font-inter overflow-hidden relative isolate">
      {/* Titre Flottant Violet */}
      <h2 className="absolute top-10 left-[140px] text-[32px] font-black tracking-tighter z-10 text-primary uppercase">
        {getTitle()}
      </h2>

      {/* Notification Violette avec Dropdown */}
      <div className="absolute top-10 right-10 z-[200]">
        <button 
          onClick={() => setShowNotifs(!showNotifs)}
          className="bubble-base w-[60px] h-[60px] bg-primary/10 hover:bg-primary/20 border-none relative cursor-pointer"
        >
          <Bell size={22} className="text-primary fill-primary/10" />
          <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
        
        {/* Dropdown */}
        {showNotifs && (
          <div className="absolute top-20 right-0 w-80 glass rounded-3xl p-4 shadow-xl animate-in slide-in-from-top-4 fade-in">
            <h4 className="font-black text-primary mb-3 px-2">Notifications</h4>
            <div className="flex flex-col gap-2">
              <div className="p-3 bg-white/60 rounded-xl text-sm font-medium">
                <strong className="text-primary">@elena_design</strong> a aimé votre style streetwear.
                <div className="text-xs text-gray-400 mt-1">Il y a 2m</div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl text-sm font-medium border border-primary/20">
                <strong className="text-primary">Système IA</strong> a évalué votre dernier upload à 92% !
                <div className="text-xs text-gray-400 mt-1">Il y a 10m</div>
              </div>
              <div className="p-3 bg-white/60 rounded-xl text-sm font-medium">
                <strong className="text-primary">@marco_vibe</strong> a commencé à vous suivre.
                <div className="text-xs text-gray-400 mt-1">Il y a 1h</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav Latérale Violette */}
      <nav className="fixed left-[30px] top-1/2 -translate-y-1/2 flex flex-col gap-5 z-[100]">
        <NavBubble to="/" icon={Home} />
        <NavBubble to="/explore" icon={Search} />
        <NavBubble to="/create" icon={PlusCircle} />
        <NavBubble to="/messages" icon={MessageSquare} />
        <NavBubble to="/profile" icon={User} />
        <NavBubble to="/analytics" icon={BarChart2} />
        <NavBubble to="/settings" icon={Settings} />
      </nav>

      {/* Zone de contenu principale */}
      <main className="absolute inset-0 flex items-center justify-center z-[1]">
        <Outlet />
      </main>
    </div>
  );
}

import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, User, BarChart2, Settings, Bell, MessageSquare, Bot, ChevronDown, LogOut, Shirt, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';

const SidebarLink = ({ to, icon: Icon, label, isCollapsed }) => (
  <NavLink 
    to={to}
    end={to === "/"}
    className={({ isActive }) => 
      `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-4 px-4'} py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 border border-transparent cursor-pointer ${
        isActive 
          ? 'bg-primary text-white shadow-[0_10px_25px_rgba(168,85,247,0.25)] scale-[1.02]' 
          : 'text-primary hover:bg-primary/10 hover:text-primary/95'
      }`
    }
    title={isCollapsed ? label : undefined}
  >
    {({ isActive }) => (
      <>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
        {!isCollapsed && <span className="animate-in fade-in duration-200">{label}</span>}
      </>
    )}
  </NavLink>
);

const MobileNavLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) => 
      `flex flex-col items-center justify-center w-12 sm:w-14 h-12 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'text-primary scale-110 font-black' 
          : 'text-primary/60 hover:text-primary'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-primary' : 'text-primary/60'} />
        <span className="text-[9px] mt-0.5 font-bold tracking-tight">{label}</span>
      </>
    )}
  </NavLink>
);

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const notifications = useSocialStore(state => state.notifications);
  const markNotificationsAsRead = useSocialStore(state => state.markNotificationsAsRead);
  const unreadCount = notifications.filter(n => !n.read).length;

  const currentUser = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleToggleNotifs = () => {
    if (!showNotifs) {
      markNotificationsAsRead();
    }
    setShowNotifs(!showNotifs);
    setShowProfileMenu(false);
  };

  const handleToggleProfile = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifs(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTitle = () => {
    switch(location.pathname) {
      case '/': return 'Style Feed';
      case '/explore': return 'EXPLORE';
      case '/create': return 'CREATE';
      case '/messages': return 'MESSAGES';
      case '/profile': return 'PROFILE';
      case '/aichat': return 'IA STYLISTE';
      case '/analytics': return 'ANALYTICS';
      case '/settings': return 'SETTINGS';
      default: return 'LAMS';
    }
  };

  return (
    <div className="flex w-screen h-screen bg-[#fafafa] text-primary font-inter overflow-hidden relative">
      
      {/* Sidebar de navigation gauche (Desktop) */}
      <aside 
        className={`${isCollapsed ? 'w-[88px] px-4' : 'w-[280px] px-6'} h-screen bg-white border-r border-primary/5 hidden lg:flex flex-col justify-between py-10 z-50 shadow-sm shrink-0 transition-all duration-300 relative`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-9 w-7 h-7 rounded-full bg-white border border-primary/10 flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/5 hover:scale-105 transition-all text-primary z-[60]"
        >
          {isCollapsed ? <ChevronRight size={14} strokeWidth={2.5} /> : <ChevronLeft size={14} strokeWidth={2.5} />}
        </button>

        <div className="flex flex-col gap-10">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 cursor-pointer overflow-hidden" onClick={() => navigate('/')}>
            {isCollapsed ? (
              <span className="text-2xl font-black tracking-tighter uppercase bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent w-full text-center">L</span>
            ) : (
              <span className="text-2xl font-black tracking-tighter uppercase bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent animate-in fade-in duration-200">Lams</span>
            )}
          </div>

          {/* Liens de navigation */}
          <nav className="flex flex-col gap-2">
            <SidebarLink to="/" icon={Home} label="Style Feed" isCollapsed={isCollapsed} />
            <SidebarLink to="/explore" icon={Search} label="Explorer" isCollapsed={isCollapsed} />
            <SidebarLink to="/create" icon={PlusCircle} label="Publier" isCollapsed={isCollapsed} />
            <SidebarLink to="/messages" icon={MessageSquare} label="Messages" isCollapsed={isCollapsed} />
            <SidebarLink to="/aichat" icon={Bot} label="Styliste IA" isCollapsed={isCollapsed} />
            <SidebarLink to="/profile" icon={User} label="Mon Profil" isCollapsed={isCollapsed} />
            <SidebarLink to="/analytics" icon={BarChart2} label="Statistiques" isCollapsed={isCollapsed} />
            <SidebarLink to="/settings" icon={Settings} label="Paramètres" isCollapsed={isCollapsed} />
          </nav>
        </div>
        
        {/* Footer Sidebar */}
        <div className={`px-3 text-xs text-gray-400 font-semibold select-none whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? 'v2.0' : 'v2.0 • Lams'}
        </div>
      </aside>

      {/* Bottom Navigation Mobile/Tablet */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white/90 backdrop-blur-md border-t border-primary/5 flex items-center justify-around px-2 pb-1 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <MobileNavLink to="/" icon={Home} label="Feed" />
        <MobileNavLink to="/explore" icon={Search} label="Explore" />
        <MobileNavLink to="/create" icon={PlusCircle} label="Publier" />
        <MobileNavLink to="/aichat" icon={Bot} label="Styliste IA" />
        <MobileNavLink to="/profile" icon={User} label="Profil" />
      </nav>

      {/* Reste de la page */}
      <div className="flex-1 h-screen flex flex-col relative overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-[64px] sm:h-[80px] w-full flex items-center justify-between px-4 lg:px-10 border-b border-primary/5 bg-white/40 backdrop-blur-md z-40">
          <div className="flex items-center gap-2.5">
            {/* Logo pour mobile */}
            <div className="flex lg:hidden items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-xl font-black tracking-tighter uppercase bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Lams</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary ml-1"></span>
            </div>
            
            <h2 className="text-md sm:text-lg lg:text-[24px] font-black tracking-tighter text-gray-800 uppercase lg:border-none pl-2.5 lg:pl-0 border-l border-primary/10 lg:border-l-0">
              {getTitle()}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Cloche de notifications */}
            <div className="relative">
              <button 
                onClick={handleToggleNotifs}
                className="bubble-base w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] bg-primary/10 hover:bg-primary/20 border-none relative cursor-pointer flex items-center justify-center rounded-full"
              >
                <Bell size={20} className="text-primary fill-primary/10" />
                {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />}
              </button>
              
              {/* Dropdown notifications */}
              {showNotifs && (
                <div className="absolute top-14 right-0 w-80 glass rounded-3xl p-4 shadow-xl animate-in slide-in-from-top-4 fade-in z-[220]">
                  <h4 className="font-black text-primary mb-3 px-2 flex justify-between items-center">
                    Notifications
                    {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>}
                  </h4>
                  <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div key={notif.id} className={`p-3 rounded-xl text-sm font-medium ${notif.read ? 'bg-white/60' : 'bg-primary/10 border border-primary/20'}`}>
                        {notif.type === 'like' && <strong className="text-primary mr-1">❤️</strong>}
                        {notif.type === 'ai' && <strong className="text-primary mr-1">🤖</strong>}
                        {notif.type === 'follow' && <strong className="text-primary mr-1">👤</strong>}
                        {notif.type === 'booking' && <strong className="text-primary mr-1">📅</strong>}
                        {notif.text}
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-sm text-gray-400 py-4">Aucune notification</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown Profil / Déconnexion */}
            <div className="relative">
              <button 
                onClick={handleToggleProfile}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border-none p-1 pr-1 sm:pr-4 rounded-full cursor-pointer transition-all duration-300 shadow-sm"
              >
                <img 
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"} 
                  alt="Profil" 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover"
                />
                <span className="font-extrabold text-sm text-primary max-w-[100px] truncate hidden md:inline">
                  {currentUser?.tag ? currentUser.tag.replace('@', '') : 'Profil'}
                </span>
                <ChevronDown size={14} className={`text-primary transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-14 right-0 w-64 glass rounded-3xl p-5 shadow-2xl border border-gray-100 z-[210] animate-in slide-in-from-top-4 fade-in">
                  <div className="flex flex-col items-center text-center pb-4 border-b border-primary/10">
                    <img 
                      src={currentUser?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full border-2 border-primary object-cover mb-2"
                    />
                    <span className="font-black text-gray-800 text-base flex items-center gap-1.5 justify-center">
                      {currentUser?.tag || "@inconnu"}
                      {currentUser?.isMentor && (
                        <span className="text-[9px] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Shirt size={9} /> Mentor
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-full">{currentUser?.email}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full py-3 px-4 rounded-xl text-left font-bold text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2 border-none bg-transparent cursor-pointer"
                    >
                      <User size={16} /> Voir mon Profil
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 px-4 rounded-xl text-left font-bold text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2 border-none bg-transparent cursor-pointer"
                    >
                      <LogOut size={16} /> Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Zone de contenu principale */}
        <main className="flex-1 overflow-auto bg-[#fafafa] flex items-center justify-center p-4 md:p-8 pb-[80px] lg:pb-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

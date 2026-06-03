import { useLocation, useNavigate } from 'react-router-dom';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { Settings, Plus, Check, Heart, MessageCircle, Star, ShieldCheck, TrendingUp, HelpCircle, Shirt, Calendar, Bookmark } from 'lucide-react';
import BookingModal from '../components/Monetization/BookingModal';
import { useState, useRef, useEffect } from 'react';

export default function Profile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { posts, followedUsers, savedPosts, toggleFollow, conversations } = useSocialStore();
  const currentUser = useAuthStore(auth => auth.user);
  const addToast = useToastStore(state => state.addToast);

  const userId = state?.userId || currentUser?.id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  if (!userId) {
    return null;
  }

  const openAuthModal = useAuthStore(auth => auth.openAuthModal);
  const userPosts = posts.filter(p => p.userId === userId);
  const isMyProfile = userId === currentUser?.id;
  const isFollowed = followedUsers.includes(userId);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleAuthRequiredAction = (actionName, actionFn) => {
    if (!currentUser) {
      openAuthModal(actionName);
      return;
    }
    actionFn();
  };

  const handleStartChat = () => {
    const existing = conversations.find(c => c.user.id === userId);
    const convId = existing ? existing.id : [currentUser?.id, userId].sort().join('_');

    if (!existing && profileInfo) {
      useSocialStore.setState(state => ({
        conversations: [
          {
            id: convId,
            user: {
              id: userId,
              tag: profileInfo.tag,
              avatar: profileInfo.avatar,
              isMentor: profileInfo.isMentor
            },
            messages: [],
            unreadCount: 0
          },
          ...state.conversations
        ]
      }));
    }

    navigate('/messages', { state: { activeConvId: convId } });
  };
  const [activeTab, setActiveTab] = useState('recent');
  const scrollContainerRef = useRef(null);

  const savedPostsData = posts.filter(p => savedPosts.includes(p.id));
  const displayedPosts = activeTab === 'recent' ? userPosts : savedPostsData;

  // Translate vertical wheel scroll to horizontal scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [displayedPosts]);

  // Mouse drag-to-scroll logic
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const avgScore = userPosts.length > 0
    ? Math.round(userPosts.reduce((acc, p) => acc + parseInt(p.score), 0) / userPosts.length)
    : 0;

  // En attendant l'implémentation de la vérification par KYC Vote communautaire
  const isIdentityVerified = currentUser?.kycStatus === 'approved';

  const profileInfo = userPosts.length > 0 ? {
    tag: userPosts[0].tag,
    avatar: userPosts[0].avatar,
    followers: 1240 + (isFollowed ? 1 : 0),
    following: 345,
    likes: userPosts.reduce((acc, curr) => acc + curr.likes, 0),
    isMentor: userPosts[0].isMentor || false,
    coachingRate: userPosts[0].coachingRate || 30
  } : isMyProfile ? {
    tag: currentUser?.tag,
    avatar: currentUser?.avatar,
    followers: 140,
    following: followedUsers.length,
    likes: 0,
    isMentor: currentUser?.isMentor || false,
    coachingRate: currentUser?.coachingRate || 30
  } : {
    tag: "@inconnu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    followers: 0,
    following: 0,
    likes: 0,
    isMentor: false,
    coachingRate: 30
  };

  return (
    <div className="w-full h-full p-4 sm:p-10 overflow-y-auto animate-in fade-in duration-500 relative">
      <div className="max-w-4xl mx-auto">

        {/* Header Profile */}
        <div className="glass rounded-[30px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="relative shrink-0">
              <img src={profileInfo.avatar} alt="avatar" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover" />
              {profileInfo.isMentor && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] sm:text-[10px] px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-widest font-black flex items-center justify-center gap-1 shadow-md w-max">
                  <Shirt size={10} fill="currentColor" className="sm:w-3 sm:h-3" /> Mentor
                </div>
              )}
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-2xl sm:text-3xl font-black text-primary mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                {profileInfo.tag}
                {isIdentityVerified && <ShieldCheck className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />}
              </h1>
              <div className="flex gap-4 sm:gap-6 text-gray-500 font-medium mt-2">
                <div className="flex flex-col"><span className="font-extrabold text-primary text-base sm:text-xl leading-none">{profileInfo.followers}</span> <span className="text-[10px] sm:text-xs">abonnés</span></div>
                <div className="flex flex-col"><span className="font-extrabold text-primary text-base sm:text-xl leading-none">{profileInfo.following}</span> <span className="text-[10px] sm:text-xs">suivis</span></div>
                <div className="flex flex-col"><span className="font-extrabold text-primary text-base sm:text-xl leading-none">{profileInfo.likes}</span> <span className="text-[10px] sm:text-xs">likes reçus</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {!isMyProfile && profileInfo.isMentor && (
              <button
                onClick={() => handleAuthRequiredAction("réserver un mentorat", () => setIsBookingOpen(true))}
                className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-extrabold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg border-none cursor-pointer text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 text-sm"
              >
                <Calendar size={18} />
                Réserver Mentorat ({profileInfo.coachingRate}$/h)
              </button>
            )}

            {isMyProfile ? (
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  navigate('/login');
                }}
                className="px-6 py-2.5 sm:py-3 rounded-full bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all border-none cursor-pointer text-sm"
              >
                Déconnexion
              </button>
            ) : (
              <div className="flex gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => handleAuthRequiredAction("s'abonner à ce créateur", () => toggleFollow(userId))}
                  className={`flex-1 sm:flex-none px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-extrabold flex items-center justify-center gap-2 transition-all duration-300 shadow-md border-none cursor-pointer text-white text-sm ${isFollowed ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-purple-700'
                    }`}
                >
                  {isFollowed ? <Check size={18} /> : <Plus size={18} />}
                  {isFollowed ? "Suivi" : "Suivre"}
                </button>
                <button
                  onClick={() => handleAuthRequiredAction("contacter ce créateur", handleStartChat)}
                  className="flex-1 sm:flex-none px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-extrabold flex items-center justify-center gap-2 transition-all duration-300 shadow-md border-none cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 text-sm"
                >
                  <MessageCircle size={18} />
                  Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION DASHBOARD MENTOR (Les 5 conditions) */}
        {isMyProfile && !profileInfo.isMentor && (
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/5 rounded-3xl p-6 mb-10 border border-primary/20 relative overflow-hidden group">
            <ShieldCheck size={180} className="absolute -right-10 -bottom-10 text-primary/10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none" />
            <h3 className="text-xl font-black text-primary mb-2 flex items-center gap-2">
              <TrendingUp size={20} /> Devenez "Mentor de Style"
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-xl">
              Prouvez votre expertise à l'IA et à la communauté pour débloquer le badge Mentor et devenir un guide officiel. Complétez ces 5 conditions :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {/* 1. Score IA */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white">
                <div className="text-xs font-bold text-gray-500 mb-2 flex justify-between">
                  <span>1. Excellence IA (Moyenne 80%)</span>
                  {avgScore >= 80 && <Check size={14} className="text-green-500" />}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-lg font-black text-primary">{avgScore}%</div>
                  <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (avgScore / 80) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* 2. Portfolio */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white">
                <div className="text-xs font-bold text-gray-500 mb-2 flex justify-between">
                  <span>2. Styles Validés (Requis: 100)</span>
                  {userPosts.length >= 100 && <Check size={14} className="text-green-500" />}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-lg font-black text-primary">{userPosts.length}</div>
                  <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (userPosts.length / 100) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* 3. Popularité */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white">
                <div className="text-xs font-bold text-gray-500 mb-2 flex justify-between">
                  <span>3. Validation Sociale (Abonnés: 500k)</span>
                  {profileInfo.followers >= 500000 && <Check size={14} className="text-green-500" />}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-lg font-black text-primary">{(profileInfo.followers / 1000).toFixed(0)}k</div>
                  <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (profileInfo.followers / 500000) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* 4. Conseils Utiles */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white">
                <div className="text-xs font-bold text-gray-500 mb-2 flex justify-between">
                  <span className="flex items-center gap-1">4. Popularité Globale <HelpCircle size={12} className="text-gray-400 cursor-help" /></span>
                  {profileInfo.likes >= 1000000 && <Check size={14} className="text-green-500" />}
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-lg font-black text-primary">{(profileInfo.likes / 1000).toFixed(0)}k <span className="text-xs text-gray-400">/ 1M likes récents</span></div>
                  <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (profileInfo.likes / 1000000) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* 5. Identité Vérifiée */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white col-span-1 md:col-span-2 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-2">
                    5. Identité Certifiée (KYC)
                    {isIdentityVerified ? <Check size={14} className="text-green-500" /> : <ShieldCheck size={14} className="text-red-400" />}
                  </div>
                  <div className="text-sm font-medium text-gray-800">Votre profil doit être validé par un vote communautaire massif.</div>
                </div>
                <button className={`px-5 py-2.5 rounded-full font-bold transition-all text-sm border-none cursor-pointer ${isIdentityVerified ? 'bg-green-500/10 text-green-600 cursor-default' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                  }`}>
                  {isIdentityVerified ? 'Profil Vérifié' : 'Démarrer la vérification'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onglets de la Grille */}
        <div className="flex items-center gap-6 mb-6 px-4 border-b border-gray-100 pb-2">
          <button
            onClick={() => setActiveTab('recent')}
            className={`text-xl font-black transition-colors bg-transparent border-none cursor-pointer pb-2 ${activeTab === 'recent' ? 'text-gray-800 border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Styles Récents ({userPosts.length})
          </button>
          {isMyProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`text-xl font-black transition-colors bg-transparent border-none cursor-pointer pb-2 flex items-center gap-2 ${activeTab === 'saved' ? 'text-gray-800 border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Bookmark size={20} className={activeTab === 'saved' ? 'fill-primary' : ''} /> Garde-Robe ({savedPostsData.length})
            </button>
          )}
        </div>

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 px-2 sm:px-4 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
        >
          {displayedPosts.map(post => (
            <div key={post.id} className="snap-start shrink-0 w-[220px] sm:w-[280px] aspect-[3/4] rounded-[24px] sm:rounded-3xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100">
              <img src={post.img} alt="post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 sm:gap-4 text-white font-bold text-sm sm:text-base">
                <div className="flex items-center gap-1 sm:gap-1.5"><Heart size={16} className="sm:w-5 sm:h-5" fill="currentColor" /> {post.likes}</div>
                <div className="flex items-center gap-1 sm:gap-1.5"><MessageCircle size={16} className="sm:w-5 sm:h-5" fill="currentColor" /> {post.comments}</div>
              </div>
            </div>
          ))}
          {displayedPosts.length === 0 && (
            <div className="w-full text-center py-20 text-gray-400 font-medium bg-gray-50 rounded-[24px] sm:rounded-3xl border border-dashed border-gray-200">
              {activeTab === 'saved' ? "Aucun style sauvegardé. Explorez le feed pour trouver l'inspiration !" : "Aucun style publié pour le moment."}
            </div>
          )}
        </div>
      </div>

      {/* Modale de Réservation Sécurisée */}
      {isBookingOpen && (
        <BookingModal
          onClose={() => setIsBookingOpen(false)}
          mentorId={userId}
          mentorName={profileInfo.tag}
          rate={profileInfo.coachingRate}
        />
      )}
    </div>
  );
}

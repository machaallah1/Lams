import { useLocation, useNavigate } from 'react-router-dom';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import { Settings, Plus, Check, Heart, MessageCircle, Star, ShieldCheck, TrendingUp, HelpCircle } from 'lucide-react';

export default function Profile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { posts, followedUsers, toggleFollow } = useSocialStore();
  const currentUser = useAuthStore(auth => auth.user);
  
  const userId = state?.userId || currentUser?.id;
  const userPosts = posts.filter(p => p.userId === userId);
  const isMyProfile = userId === currentUser?.id;
  const isFollowed = followedUsers.includes(userId);
  
  const avgScore = userPosts.length > 0 
    ? Math.round(userPosts.reduce((acc, p) => acc + parseInt(p.score), 0) / userPosts.length) 
    : 0;

  // Simulation des données pour les conditions Mentor
  const helpfulVotes = 12; // Simulation : nombre de votes utiles reçus
  const isIdentityVerified = false; // Simulation : statut d'identité vérifiée

  const profileInfo = userPosts.length > 0 ? {
    tag: userPosts[0].tag,
    avatar: userPosts[0].avatar,
    followers: 1240 + (isFollowed ? 1 : 0),
    following: 345,
    likes: userPosts.reduce((acc, curr) => acc + curr.likes, 0),
    isMentor: userPosts.length >= 15 && avgScore >= 85 // Condition globale simulée
  } : {
    tag: currentUser?.tag,
    avatar: currentUser?.avatar,
    followers: 140, 
    following: followedUsers.length,
    likes: 0,
    isMentor: false
  };

  return (
    <div className="w-full h-full p-10 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Profile */}
        <div className="glass rounded-[40px] p-8 flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <img src={profileInfo.avatar} alt="avatar" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
              {profileInfo.isMentor && (
                <div className="absolute -bottom-2 relative left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black flex items-center justify-center gap-1 shadow-md w-max">
                  <Star size={12} fill="currentColor" /> Mentor
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary mb-2 flex items-center gap-3">
                {profileInfo.tag}
                {isIdentityVerified && <ShieldCheck className="text-green-500" size={24} />}
              </h1>
              <div className="flex gap-6 text-gray-500 font-medium mt-3">
                <div className="flex flex-col"><span className="font-extrabold text-primary text-xl leading-none">{profileInfo.followers}</span> <span className="text-xs">abonnés</span></div>
                <div className="flex flex-col"><span className="font-extrabold text-primary text-xl leading-none">{profileInfo.following}</span> <span className="text-xs">suivis</span></div>
                <div className="flex flex-col"><span className="font-extrabold text-primary text-xl leading-none">{profileInfo.likes}</span> <span className="text-xs">likes reçus</span></div>
              </div>
            </div>
          </div>
          
          <div>
            {isMyProfile ? (
              <button 
                onClick={() => {
                  useAuthStore.getState().logout();
                  navigate('/login');
                }}
                className="px-6 py-3 rounded-full bg-red-500/10 text-red-500 font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all border-none cursor-pointer"
              >
                Déconnexion
              </button>
            ) : (
              <button 
                onClick={() => toggleFollow(userId)}
                className={`px-8 py-3 rounded-full font-extrabold flex items-center gap-2 transition-all duration-300 shadow-md border-none cursor-pointer text-white ${
                  isFollowed ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-purple-700'
                }`}
              >
                {isFollowed ? <Check size={20} /> : <Plus size={20} />}
                {isFollowed ? "Suivi" : "Suivre"}
              </button>
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
                   <span>1. Excellence IA (Moyenne 85%)</span>
                   {avgScore >= 85 && <Check size={14} className="text-green-500" />}
                 </div>
                 <div className="flex justify-between items-end">
                   <div className="text-lg font-black text-primary">{avgScore}%</div>
                   <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (avgScore/85)*100)}%` }} />
                   </div>
                 </div>
               </div>
               
               {/* 2. Portfolio */}
               <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white">
                 <div className="text-xs font-bold text-gray-500 mb-2 flex justify-between">
                   <span>2. Styles Actifs (Requis: 15)</span>
                   {userPosts.length >= 15 && <Check size={14} className="text-green-500" />}
                 </div>
                 <div className="flex justify-between items-end">
                   <div className="text-lg font-black text-primary">{userPosts.length}</div>
                   <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (userPosts.length/15)*100)}%` }} />
                   </div>
                 </div>
               </div>

               {/* 3. Popularité */}
               <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white">
                 <div className="text-xs font-bold text-gray-500 mb-2 flex justify-between">
                   <span>3. Validation Sociale (Abonnés: 1000)</span>
                   {profileInfo.followers >= 1000 && <Check size={14} className="text-green-500" />}
                 </div>
                 <div className="flex justify-between items-end">
                   <div className="text-lg font-black text-primary">{profileInfo.followers}</div>
                   <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (profileInfo.followers/1000)*100)}%` }} />
                   </div>
                 </div>
               </div>

               {/* 4. Conseils Utiles */}
               <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white">
                 <div className="text-xs font-bold text-gray-500 mb-2 flex justify-between">
                   <span className="flex items-center gap-1">4. Sens Pédagogique <HelpCircle size={12} className="text-gray-400 cursor-help" title="Votes utiles reçus sur vos commentaires" /></span>
                   {helpfulVotes >= 50 && <Check size={14} className="text-green-500" />}
                 </div>
                 <div className="flex justify-between items-end">
                   <div className="text-lg font-black text-primary">{helpfulVotes} <span className="text-xs text-gray-400">/ 50 votes reçus</span></div>
                   <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (helpfulVotes/50)*100)}%` }} />
                   </div>
                 </div>
               </div>

               {/* 5. Identité Vérifiée */}
               <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white col-span-1 md:col-span-2 flex justify-between items-center">
                 <div>
                   <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-2">
                     5. Identité Certifiée 
                     {isIdentityVerified ? <Check size={14} className="text-green-500" /> : <ShieldCheck size={14} className="text-red-400" />}
                   </div>
                   <div className="text-sm font-medium text-gray-800">Candidature à soumettre avec vérification O.T.P. et Live Photo.</div>
                 </div>
                 <button className={`px-5 py-2.5 rounded-full font-bold transition-all text-sm border-none cursor-pointer ${
                   isIdentityVerified ? 'bg-green-500/10 text-green-600 cursor-default' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                 }`}>
                   {isIdentityVerified ? 'Profil Vérifié' : 'Démarrer la vérification'}
                 </button>
               </div>
             </div>
          </div>
        )}

        {/* Grille de posts */}
        <h2 className="text-2xl font-black text-gray-800 mb-6 px-4">Styles Récents ({userPosts.length})</h2>
        <div className="grid grid-cols-3 gap-6 mb-20">
          {userPosts.map(post => (
            <div key={post.id} className="aspect-[3/4] rounded-3xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100">
              <img src={post.img} alt="post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white font-bold">
                <div className="flex items-center gap-1.5"><Heart size={20} fill="currentColor" /> {post.likes}</div>
                <div className="flex items-center gap-1.5"><MessageCircle size={20} fill="currentColor" /> {post.comments}</div>
              </div>
            </div>
          ))}
          {userPosts.length === 0 && (
            <div className="col-span-3 text-center py-20 text-gray-400 font-medium bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              Aucun style publié pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

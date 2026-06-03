import FeedSocial from '../components/Social/FeedSocial';
import { useSocialStore } from '../store/socialStore';
import { Cpu, TrendingUp, UserCheck, ChevronRight, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const posts = useSocialStore(state => state.posts);
  
  // Get unique mentors from posts or default fallback
  const mentors = [
    { tag: "@sophie_chic", name: "Sophie Chic", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop", bio: "Styliste pro" },
    { tag: "@alex_streetwear", name: "Alex Streetwear", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop", bio: "Addict sneakers" }
  ];

  const getUserIdByTag = (tag) => {
    const post = posts.find(p => p.tag === tag);
    return post ? post.userId : null;
  };

  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-8 justify-center items-start max-w-6xl mx-auto p-4">
      {/* Colonne Feed (Centre) */}
      <div className="flex-1 w-full flex flex-col gap-6 items-center h-full overflow-y-auto scrollbar-none pb-4">
        
        {/* Mentors en bandeau horizontal pour mobile/tablette (visible sous xl) */}
        <div className="xl:hidden w-full max-w-[600px] flex flex-col gap-3 shrink-0">
          <h3 className="font-black text-gray-800 text-xs flex items-center gap-2 uppercase tracking-wider px-2">
            <UserCheck size={14} className="text-primary" /> Mentors à Suivre
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none px-2 snap-x snap-mandatory">
            {mentors.map((mentor, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  const uId = getUserIdByTag(mentor.tag);
                  navigate('/profile', { state: { userId: uId } });
                }}
                className="snap-start shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-primary/5 shadow-sm cursor-pointer hover:bg-primary/5 transition-all w-[90px]"
              >
                <div className="relative">
                  <img src={mentor.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-0.5 shadow-sm">
                    <Shirt size={8} />
                  </div>
                </div>
                <span className="font-extrabold text-[10px] text-gray-800 truncate w-full text-center">{mentor.tag.replace('@', '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex-1 flex justify-center items-center min-h-0">
          <FeedSocial />
        </div>
      </div>

      {/* Colonne Suggestions / Tendances (Droite) */}
      <div className="w-[320px] hidden xl:flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 py-4">
        
        {/* Mentors Populaires */}
        <div className="glass rounded-[30px] p-6 flex flex-col gap-4">
          <h3 className="font-black text-gray-800 text-sm flex items-center gap-2 uppercase tracking-wider">
            <UserCheck size={16} className="text-primary" /> Mentors à Suivre
          </h3>
          <div className="flex flex-col gap-3">
            {mentors.map((mentor, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-2xl hover:bg-primary/5 transition-all">
                <div className="flex items-center gap-3">
                  <img src={mentor.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-xs text-primary">{mentor.tag}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{mentor.bio}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const uId = getUserIdByTag(mentor.tag);
                    navigate('/profile', { state: { userId: uId } });
                  }}
                  className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white border-none cursor-pointer transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tendances de Style */}
        <div className="glass rounded-[30px] p-6 flex flex-col gap-4">
          <h3 className="font-black text-gray-800 text-sm flex items-center gap-2 uppercase tracking-wider">
            <TrendingUp size={16} className="text-primary" /> Tendances
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { tag: "#Streetwear", count: "124 styles", score: "92%" },
              { tag: "#ChicStyle", count: "89 styles", score: "88%" },
              { tag: "#Minimalist", count: "65 styles", score: "82%" }
            ].map((trend, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded-2xl bg-white/50 border border-primary/5">
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-xs text-gray-700">{trend.tag}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">{trend.count}</span>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Cpu size={10} /> {trend.score}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

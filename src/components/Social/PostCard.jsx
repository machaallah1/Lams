import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Cpu, Plus, Check, Shirt } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import { useToastStore } from '../../store/toastStore';
import { useNavigate } from 'react-router-dom';
import ShareModal from './ShareModal';

export default function PostCard({ post, onOpenComments }) {
  const { followedUsers, likedPosts, savedPosts, toggleFollow, toggleLike, toggleSave } = useSocialStore();
  const addToast = useToastStore(state => state.addToast);
  const navigate = useNavigate();
  
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showAiDetails, setShowAiDetails] = useState(false);

  const isFollowed = followedUsers.includes(post.userId);
  const isLiked = likedPosts.includes(post.id);
  const isSaved = savedPosts?.includes(post.id) || false;

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleSave = () => {
    toggleSave(post.id);
    addToast(isSaved ? "Style retiré des favoris" : "Style sauvegardé dans vos collections !", "success");
  };

  return (
    <div className="w-[600px] h-[88vh] glass rounded-[50px] p-[25px] flex flex-col justify-between relative transition-all duration-500 m-0">
      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={() => navigate('/profile', { state: { userId: post.userId } })}
          className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0 group"
        >
          <img 
            src={post.avatar} 
            alt="avatar" 
            className="w-[55px] h-[55px] rounded-full border-[3px] border-white shadow-md group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col items-start">
            <span className="font-black text-primary text-base group-hover:text-primary/80 transition-colors flex items-center gap-2">
              {post.tag}
              {post.isMentor && (
                <span className="text-[10px] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1" title="Style Mentor">
                  <Shirt size={10} /> Mentor
                </span>
              )}
            </span>
          </div>
        </button>

        <button 
          onClick={() => toggleFollow(post.userId)}
          className={`px-5 py-2.5 rounded-full font-extrabold flex items-center gap-2 transition-all duration-300 text-white shadow-sm ${
            isFollowed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isFollowed ? <Check size={16} /> : <Plus size={16} />}
          {isFollowed ? "Suivi" : "Suivre"}
        </button>
      </div>

      {/* Image */}
      <div className="w-full flex-1 rounded-[35px] overflow-hidden my-5 relative group cursor-pointer shadow-inner bg-black flex items-center justify-center">
        <img 
          src={post.img} 
          alt="Fashion" 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center z-10">
        <div className="flex gap-2.5">
          <div className="relative">
            <button 
              onMouseEnter={() => setShowAiDetails(true)}
              onMouseLeave={() => setShowAiDetails(false)}
              className="w-[58px] h-[58px] rounded-full bg-white border-2 border-primary hover:bg-primary/5 flex flex-col items-center justify-center text-primary shadow-sm cursor-help transition-colors border-none"
            >
              <Cpu size={14} />
              <span className="text-[10px] font-black">{post.score}</span>
            </button>
            
            {showAiDetails && post.aiEvaluation && (
              <div className="absolute bottom-full left-0 mb-4 w-[280px] bg-white rounded-[25px] p-5 shadow-2xl border border-gray-100 z-50 animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-black text-primary text-sm flex items-center gap-2"><Cpu size={16}/> Analyse IA</h4>
                  <span className="text-xl font-black text-primary">{post.score}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-gray-600"><span className="font-bold">Style Général</span><span className="font-black text-primary">{post.aiEvaluation.styleScore}%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${post.aiEvaluation.styleScore}%` }}></div></div>

                  <div className="flex justify-between text-[11px] text-gray-600 mt-2"><span className="font-bold">Harmonie</span><span className="font-black text-pink-500">{post.aiEvaluation.harmonyScore}%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${post.aiEvaluation.harmonyScore}%` }}></div></div>

                  <div className="flex justify-between text-[11px] text-gray-600 mt-2"><span className="font-bold">Cohérence</span><span className="font-black text-blue-500">{post.aiEvaluation.coherenceScore}%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${post.aiEvaluation.coherenceScore}%` }}></div></div>

                  <div className="flex justify-between text-[11px] text-gray-600 mt-2"><span className="font-bold">Propreté & Fit</span><span className="font-black text-green-500">{post.aiEvaluation.cleanlinessScore}%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${post.aiEvaluation.cleanlinessScore}%` }}></div></div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[9px] text-center text-gray-400 font-bold uppercase tracking-wider">
                  Auto-évalué par Vision IA
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => toggleLike(post.id)}
            className={`w-[58px] h-[58px] rounded-[50%] flex flex-col justify-center items-center transition-all duration-300 cursor-pointer border-none shadow-sm ${
              isLiked ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <Heart size={22} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""} />
            <span className="text-[10px] font-extrabold mt-0.5">{post.likes}</span>
          </button>

          <button 
            onClick={onOpenComments}
            className="w-[58px] h-[58px] rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex flex-col justify-center items-center transition-all duration-300 border-none cursor-pointer shadow-sm"
          >
            <MessageCircle size={22} />
            <span className="text-[10px] font-extrabold mt-0.5">{post.comments}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="w-[58px] h-[58px] rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex flex-col justify-center items-center transition-all duration-300 border-none cursor-pointer shadow-sm"
          >
            <Share2 size={22} />
            <span className="text-[10px] font-extrabold mt-0.5">{post.shares}</span>
          </button>
        </div>
        <button 
          onClick={handleSave}
          className={`w-[58px] h-[58px] rounded-full flex justify-center items-center transition-all duration-300 border-none cursor-pointer shadow-sm ${
            isSaved ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {isShareOpen && <ShareModal post={post} onClose={() => setIsShareOpen(false)} />}
    </div>
  );
}

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Cpu, Plus, Check } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import { useToastStore } from '../../store/toastStore';
import { useNavigate } from 'react-router-dom';
import ShareModal from './ShareModal';

export default function PostCard({ post, onOpenComments }) {
  const { followedUsers, likedPosts, savedPosts, toggleFollow, toggleLike, toggleSave } = useSocialStore();
  const addToast = useToastStore(state => state.addToast);
  const navigate = useNavigate();
  
  const [isShareOpen, setIsShareOpen] = useState(false);

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
          <span className="font-black text-primary text-base group-hover:text-primary/80 transition-colors">
            {post.tag}
          </span>
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
          <div className="w-[58px] h-[58px] rounded-full bg-white border-2 border-primary flex flex-col items-center justify-center text-primary shadow-sm pointer-events-none">
            <Cpu size={14} />
            <span className="text-[10px] font-black">{post.score}</span>
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

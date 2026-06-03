import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Cpu, Plus, Check, Shirt, Send } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import ShareModal from './ShareModal';

export default function PostCard({ post }) {
  const { followedUsers, likedPosts, savedPosts, toggleFollow, toggleLike, toggleSave, postComments, submitComment, fetchComments } = useSocialStore();
  const addToast = useToastStore(state => state.addToast);
  const currentUser = useAuthStore(state => state.user);
  const navigate = useNavigate();
  
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showAiDetails, setShowAiDetails] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (showComments) {
      fetchComments(post.id);
    }
  }, [showComments, post.id, fetchComments]);

  const isFollowed = followedUsers.includes(post.userId);
  const isLiked = likedPosts.includes(post.id);
  const isSaved = savedPosts?.includes(post.id) || false;
  const comments = postComments[post.id] || [];

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleSave = () => {
    toggleSave(post.id);
    addToast(isSaved ? "Style retiré des favoris" : "Style sauvegardé dans vos collections !", "success");
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      submitComment(post.id, newComment, currentUser, null);
      setNewComment('');
      addToast("Commentaire ajouté !", "success");
    }
  };

  return (
    <div className="w-full max-w-[600px] h-[68vh] sm:h-[82vh] max-h-[480px] sm:max-h-[750px] glass rounded-[35px] sm:rounded-[50px] p-4 sm:p-[25px] flex flex-col justify-between relative transition-all duration-500 m-0 shadow-lg animate-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <button 
          onClick={() => navigate('/profile', { state: { userId: post.userId } })}
          className="flex items-center gap-2 sm:gap-3 bg-transparent border-none cursor-pointer p-0 group"
        >
          <img 
            src={post.avatar} 
            alt="avatar" 
            className="w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] rounded-full border-[2.5px] sm:border-[3px] border-white shadow-md group-hover:scale-105 transition-transform object-cover" 
          />
          <div className="flex flex-col items-start text-left">
            <span className="font-black text-primary text-sm sm:text-base group-hover:text-primary/80 transition-colors flex items-center gap-1.5">
              {post.tag}
              {post.isMentor && (
                <span className="text-[9px] sm:text-[10px] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1" title="Style Mentor">
                  <Shirt size={9} /> Mentor
                </span>
              )}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-semibold mt-0.5">
              Style : <span className="text-primary font-extrabold">{post.detectedStyle || "Inconnu"}</span>
            </span>
          </div>
        </button>

        <button 
          onClick={() => toggleFollow(post.userId)}
          className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full font-extrabold flex items-center gap-1.5 transition-all duration-300 text-xs sm:text-sm border-none cursor-pointer ${
            isFollowed 
              ? 'bg-primary/15 text-primary hover:bg-primary/25' 
              : 'bg-primary text-white hover:bg-purple-700 shadow-md hover:scale-[1.02]'
          }`}
        >
          {isFollowed ? <Check size={12} className="sm:w-3.5 sm:h-3.5" /> : <Plus size={12} className="sm:w-3.5 sm:h-3.5" />}
          {isFollowed ? "Suivi" : "Suivre"}
        </button>
      </div>

      {/* Image */}
      <div className="w-full flex-1 min-h-0 rounded-[24px] sm:rounded-[35px] overflow-hidden my-2 sm:my-5 relative group cursor-pointer shadow-inner bg-black flex items-center justify-center">
        <img 
          src={post.img} 
          alt="Fashion" 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center z-10">
        <div className="flex gap-1.5 sm:gap-2.5">
          <div className="relative">
            <button 
              onMouseEnter={() => setShowAiDetails(true)}
              onMouseLeave={() => setShowAiDetails(false)}
              className="w-[45px] h-[45px] sm:w-[58px] sm:h-[58px] rounded-full bg-primary/10 hover:bg-primary/20 flex flex-col items-center justify-center text-primary shadow-sm cursor-help transition-all duration-300 border-none"
            >
              <Cpu size={18} className="text-primary sm:w-[22px] sm:h-[22px]" />
              <span className="text-[9px] sm:text-[10px] font-extrabold mt-0.5">{post.score}</span>
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
            className={`w-[45px] h-[45px] sm:w-[58px] sm:h-[58px] rounded-[50%] flex flex-col justify-center items-center transition-all duration-300 cursor-pointer border-none shadow-sm ${
              isLiked ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={`text-primary sm:w-[22px] sm:h-[22px] ${isLiked ? "text-red-500 animate-bounce" : ""}`} />
            <span className="text-[9px] sm:text-[10px] font-extrabold mt-0.5">{post.likes}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className={`w-[45px] h-[45px] sm:w-[58px] sm:h-[58px] rounded-full flex flex-col justify-center items-center transition-all duration-300 border-none cursor-pointer shadow-sm ${
              showComments ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <MessageCircle size={18} className={showComments ? 'text-white' : 'text-primary'} />
            <span className="text-[9px] sm:text-[10px] font-extrabold mt-0.5">{comments.length}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="w-[45px] h-[45px] sm:w-[58px] sm:h-[58px] rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex flex-col justify-center items-center transition-all duration-300 border-none cursor-pointer shadow-sm"
          >
            <Share2 size={18} className="text-primary sm:w-[22px] sm:h-[22px]" />
            <span className="text-[9px] sm:text-[10px] font-extrabold mt-0.5">{post.shares}</span>
          </button>
        </div>
        <button 
          onClick={handleSave}
          className={`w-[45px] h-[45px] sm:w-[58px] sm:h-[58px] rounded-full flex justify-center items-center transition-all duration-300 border-none cursor-pointer shadow-sm ${
            isSaved ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} className={isSaved ? 'text-white' : 'text-primary'} />
        </button>
      </div>

      {/* Inline Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-primary/10 flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300 z-10 shrink-0">
          {/* Comments List */}
          <div className="max-h-[90px] overflow-y-auto flex flex-col gap-1.5 pr-1 scrollbar-none">
            {comments.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-1 font-medium">Soyez le premier à commenter !</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="text-[11px] bg-primary/5 p-1.5 px-2.5 rounded-xl text-left border border-primary/5">
                  <span className="font-extrabold text-primary mr-1.5">{c.user}:</span>
                  <span className="text-gray-700 font-medium">{c.text}</span>
                </div>
              ))
            )}
          </div>
          
          {/* Input Area */}
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newComment} 
              onChange={e => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 bg-gray-50 border border-primary/20 rounded-xl px-3 py-1.5 text-[11px] outline-none focus:border-primary focus:bg-white transition-all text-gray-700 font-medium"
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
            />
            <button 
              onClick={handleAddComment}
              className="bg-primary hover:bg-purple-700 text-white rounded-xl px-3 py-1.5 text-[11px] font-black border-none cursor-pointer shadow-md hover:scale-105 transition-transform"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}

      {isShareOpen && <ShareModal post={post} onClose={() => setIsShareOpen(false)} />}
    </div>
  );
}

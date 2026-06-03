import { useState, useRef } from 'react';
import { X, Reply, Send, MessageCircle } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

export default function CommentsModal({ post, onClose }) {
  const { postComments, submitComment } = useSocialStore();
  const user = useAuthStore(state => state.user);
  const addToast = useToastStore(state => state.addToast);
  
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const inputRef = useRef(null);
  
  const comments = postComments[post.id] || [];

  const handleSubmit = () => {
    if (commentText.trim()) {
      submitComment(post.id, commentText, user, replyingTo?.id || null);
      setCommentText('');
      setReplyingTo(null);
      addToast(replyingTo ? 'Réponse envoyée !' : 'Commentaire ajouté !', 'success');
    }
  };

  const handleReplyClick = (parentId, replyUser, isSubReply = false) => {
    setReplyingTo({ id: parentId, user: replyUser });
    if (isSubReply) {
      setCommentText(`${replyUser} `);
    } else {
      setCommentText(''); // Clear if replying to parent
    }
    inputRef.current?.focus();
  };

  return (
    <div 
      className="fixed inset-0 z-[200000] flex justify-center items-center bg-white/95 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg md:max-w-[1200px] h-[85vh] md:h-[90vh] flex overflow-hidden animate-in zoom-in-95 duration-300 mx-4 rounded-[30px] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Partie Gauche : Post */}
        <div className="w-full md:w-1/2 h-full hidden md:flex flex-col relative border-r border-primary/10 bg-white shadow-[-50px_0_100px_rgba(168,85,247,0.1)] rounded-l-[30px] z-10">
          <div className="p-5 border-b border-primary/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-primary/20 shadow-sm object-cover" />
              <div>
                <span className="font-black text-primary block">{post.tag}</span>
                <span className="text-xs text-gray-400">Posté il y a 2h</span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
            <img src={post.img} alt="Post image" className="w-full h-full object-contain" />
          </div>
          <div className="p-5 flex justify-around items-center bg-white">
            <div className="text-center"><div className="text-2xl font-black text-red-500">{post.likes}</div><div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Likes</div></div>
            <div className="text-center"><div className="text-2xl font-black text-primary">{post.comments}</div><div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Avis</div></div>
            <div className="text-center"><div className="text-2xl font-black text-green-500">{post.shares}</div><div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Partages</div></div>
            <div className="text-center"><div className="text-2xl font-black text-orange-500">{post.score}</div><div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Note IA</div></div>
          </div>
        </div>

        {/* Partie Droite : Commentaires */}
        <div className="w-full md:w-1/2 h-full flex flex-col bg-gray-50 rounded-[30px] md:rounded-l-none md:rounded-r-[30px] shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-primary/10 bg-white flex justify-between items-center shadow-sm z-10">
            <h3 className="text-lg font-black text-primary m-0 uppercase tracking-widest">Commentaires</h3>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors border-none cursor-pointer">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-gray-50/50">
            {comments.length === 0 ? (
              <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                <MessageCircle size={40} className="opacity-30 mb-2" />
                <p>Soyez le premier à commenter !</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="mb-6 flex flex-col">
                  {/* Parent Comment */}
                  <div className="bg-white p-4 rounded-[20px] shadow-sm mb-2 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <span className="font-extrabold text-primary text-sm">{comment.user}</span>
                         <span className="text-[10px] text-gray-400 font-medium">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <button onClick={() => handleReplyClick(comment.id, comment.user, false)} className="text-[10px] text-gray-500 font-bold hover:text-primary transition-colors cursor-pointer border-none bg-primary/5 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider">
                        <Reply size={12} /> Répondre
                      </button>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">{comment.text}</p>
                  </div>
                  
                  {/* Nested Replies (Sous-commentaires) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 ml-4 border-l-2 border-primary/10 flex flex-col gap-3 mt-1">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="bg-primary/5 p-3 rounded-[16px]">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                               <span className="font-extrabold text-gray-700 text-xs">{reply.user}</span>
                               <span className="text-[10px] text-gray-400 font-medium">{new Date(reply.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <button onClick={() => handleReplyClick(comment.id, reply.user, true)} className="text-[9px] text-gray-500 font-bold hover:text-primary transition-colors cursor-pointer border-none bg-white px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider shadow-sm">
                              <Reply size={10} /> Répondre
                            </button>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed font-medium">
                            {/* Styliser automatiquement les mentions @username en violet */}
                            {reply.text.split(' ').map((word, i) => 
                              word.startsWith('@') ? <span key={i} className="text-primary font-bold">{word} </span> : word + ' '
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 sm:p-5 border-t border-primary/10 bg-white flex flex-col gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-10">
            {replyingTo && (
              <div className="flex items-center justify-between bg-primary/10 px-4 py-2 rounded-xl mb-1">
                <span className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2"><Reply size={14}/> En réponse à {replyingTo.user}</span>
                <button onClick={() => setReplyingTo(null)} className="text-primary hover:text-red-500 border-none bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-colors">
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-2 sm:gap-3">
              <input 
                ref={inputRef}
                type="text" 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={replyingTo ? "Écrivez votre réponse..." : "Écrire un commentaire..."}
                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 border border-primary/20 rounded-2xl outline-none text-xs sm:text-sm bg-gray-50 focus:border-primary focus:bg-white transition-all text-gray-700 font-medium"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button 
                onClick={handleSubmit}
                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-purple-700 transition-colors shadow-lg border-none cursor-pointer flex-shrink-0"
              >
                <Send size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, Info, CheckCheck, MessageSquare, X } from 'lucide-react';
import { useSocialStore } from '../store/socialStore';
import PostCard from '../components/Social/PostCard';
import CommentsModal from '../components/Social/CommentsModal';

export default function Messages() {
  const conversations = useSocialStore(state => state.conversations);
  const sendMessage = useSocialStore(state => state.sendMessage);
  
  const [activeConvId, setActiveConvId] = useState(conversations.length > 0 ? conversations[0].id : null);
  const [inputText, setInputText] = useState('');
  const [viewingPost, setViewingPost] = useState(null);
  const [commentsPost, setCommentsPost] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  const activeConv = conversations.find(c => c.id === activeConvId);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConv?.messages]);

  const handleSend = () => {
    if (inputText.trim() && activeConvId) {
      sendMessage(activeConvId, inputText);
      setInputText('');
    }
  };

  return (
    <div className="relative w-[1100px] max-w-[90vw] h-[82vh] flex gap-6 items-stretch justify-center mx-auto mt-6">
      
      {/* Sidebar - Inbox */}
      <div className="w-[350px] h-full glass rounded-[40px] flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(168,85,247,0.15)] relative animate-in fade-in slide-in-from-left-8 duration-500">
        <div className="p-7 border-b border-primary/10 bg-white/30 backdrop-blur-md">
          <h2 className="text-xl font-black text-primary m-0 uppercase tracking-widest">Discussions</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white/20">
          {conversations.map(conv => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const isActive = activeConvId === conv.id;
            
            return (
              <div 
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`flex items-center gap-4 p-5 cursor-pointer transition-all border-b border-primary/5 hover:bg-white/40 ${isActive ? 'bg-white/80 shadow-md scale-[1.02] rounded-2xl mx-2 my-1' : ''}`}
              >
                <div className="relative">
                  <img src={conv.user.avatar} alt="avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-extrabold text-gray-800 text-sm tracking-wide">{conv.user.tag}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{new Date(lastMsg?.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-black text-primary' : 'text-gray-500 font-medium'}`}>
                    {lastMsg?.senderId === 'me' ? 'Vous: ' : ''}
                    {lastMsg?.type === 'share' ? '🔗 A partagé un style' : lastMsg?.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="flex-1 h-full glass rounded-[40px] flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(168,85,247,0.15)] relative bg-white/40 animate-in fade-in slide-in-from-right-8 duration-500">
        {activeConv ? (
          <>
            {/* Thread Header */}
            <div className="h-[90px] bg-white/80 backdrop-blur-xl px-10 flex justify-between items-center border-b border-primary/10 shadow-sm z-10">
              <div className="flex items-center gap-5">
                <div className="relative cursor-pointer group">
                  <img src={activeConv.user.avatar} alt="avatar" className="w-[52px] h-[52px] rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-white" />
                </div>
                <div>
                  <h3 className="text-[17px] font-black text-primary m-0 tracking-wide">{activeConv.user.tag}</h3>
                  <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">En Ligne</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 border-none cursor-pointer transition-colors"><Phone size={20}/></button>
                <button className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 border-none cursor-pointer transition-colors"><Video size={20}/></button>
                <button className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 border-none cursor-pointer transition-colors"><Info size={20}/></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-6 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-10">
              <div className="w-full text-center mt-2 mb-6">
                <span className="text-[10px] uppercase tracking-widest font-black text-white bg-primary/30 px-5 py-2 rounded-full backdrop-blur-md shadow-sm">Aujourd'hui</span>
              </div>
              
              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 w-full`}>
                    <div className={`max-w-[65%] p-4 shadow-sm flex flex-col gap-1.5 ${
                      isMe 
                        ? 'bg-gradient-to-br from-primary to-purple-700 text-white rounded-[28px] rounded-br-[8px] shadow-lg shadow-primary/20' 
                        : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-[28px] rounded-bl-[8px] border border-white shadow-md'
                    }`}>
                      {msg.type === 'share' && msg.post && (
                        <div 
                          onClick={() => setViewingPost(msg.post)}
                          className="mb-3 rounded-2xl overflow-hidden shadow-inner cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all bg-black/20 w-[220px]"
                        >
                          <img src={msg.post.img} alt="Shared style" className="w-full h-[280px] object-cover" />
                          <div className={`p-3 text-[11px] font-black tracking-wide ${isMe ? 'bg-black/20 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            {msg.post.tag}
                          </div>
                        </div>
                      )}
                      <p className="text-[15px] font-medium leading-relaxed m-0">{msg.text}</p>
                      <div className={`text-[10px] font-bold flex justify-end items-center gap-1.5 mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {isMe && <CheckCheck size={14} className="opacity-90" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-4" /> {/* Spacer */}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/90 backdrop-blur-xl border-t border-primary/10 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-full border border-primary/20 shadow-inner group focus-within:border-primary focus-within:bg-white transition-all">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Écrivez un message..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-[15px] font-medium text-gray-700 placeholder-gray-400"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="w-[46px] h-[46px] rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all border-none cursor-pointer shadow-lg shadow-primary/30 flex-shrink-0"
                >
                  <Send size={18} className="translate-x-[1px]" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-primary/40 gap-6 glass animate-in fade-in duration-700">
            <div className="w-32 h-32 rounded-full bg-white/50 flex items-center justify-center shadow-inner border-[4px] border-white">
              <MessageSquare size={50} strokeWidth={1.5} className="text-primary/60" />
            </div>
            <span className="font-black text-xl tracking-wider text-primary/70">SÉLECTIONNEZ UNE CONVERSATION</span>
          </div>
        )}
      </div>

      {/* Modal pour afficher le Post cliqué */}
      {viewingPost && (
        <div 
          className="fixed inset-0 z-[300000] flex justify-center items-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setViewingPost(null)}
        >
          <button 
            className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/10 text-white flex justify-center items-center hover:bg-white/20 transition-colors border-none cursor-pointer z-[300001]"
            onClick={() => setViewingPost(null)}
          >
            <X size={28} />
          </button>
          <div onClick={e => e.stopPropagation()} className="animate-in zoom-in-95 duration-300">
            <PostCard post={viewingPost} onOpenComments={() => setCommentsPost(viewingPost)} />
          </div>
        </div>
      )}

      {/* Modal pour les Commentaires du Post */}
      {commentsPost && (
        <CommentsModal post={commentsPost} onClose={() => setCommentsPost(null)} />
      )}

    </div>
  );
}

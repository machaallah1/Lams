import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Link2, MessageSquare, Send, Check, Hash, Globe, AtSign, Smartphone } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { useSocialStore } from '../../store/socialStore';

export default function ShareModal({ post, onClose }) {
  const addToast = useToastStore(state => state.addToast);
  const sendPostShare = useSocialStore(state => state.sendPostShare);
  const [sentTo, setSentTo] = useState([]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast("Lien du style copié !", "success");
    onClose();
  };

  const handleSendToFriend = (friend) => {
    if(!sentTo.includes(friend.id)) {
      setSentTo([...sentTo, friend.id]);
      sendPostShare(friend.id, post, friend);
      addToast("Style envoyé en message privé !", "success");
    }
  };

  const friends = [
    { id: 'u1', tag: '@elena_design', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' },
    { id: 'u2', tag: '@marco_vibe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150' },
    { id: 'u3', tag: '@sofia_officiel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150' },
  ];

  return createPortal(
    <div 
      className="fixed inset-0 z-[200000] flex justify-center items-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div 
        className="w-[90vw] max-w-[450px] bg-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-black text-gray-800 m-0 uppercase tracking-widest">Partager</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-200/50 text-gray-500 flex items-center justify-center hover:bg-gray-200 hover:text-gray-800 transition-colors border-none cursor-pointer shadow-sm">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Réseaux Sociaux Externes</div>
          <div className="flex justify-between items-center mb-8 gap-2">
            <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 border-none bg-transparent cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-600 flex justify-center items-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm"><Link2 size={24} /></div>
              <span className="text-[10px] font-bold text-gray-500">Copier</span>
            </button>
            <button className="flex flex-col items-center gap-2 border-none bg-transparent cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-[#E1F0FF] text-[#1DA1F2] flex justify-center items-center group-hover:scale-110 transition-transform duration-300 shadow-sm"><Hash size={24} /></div>
              <span className="text-[10px] font-bold text-gray-500">Twitter</span>
            </button>
            <button className="flex flex-col items-center gap-2 border-none bg-transparent cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-[#EAF2FA] text-[#1877F2] flex justify-center items-center group-hover:scale-110 transition-transform duration-300 shadow-sm"><Globe size={24} /></div>
              <span className="text-[10px] font-bold text-gray-500">Facebook</span>
            </button>
            <button className="flex flex-col items-center gap-2 border-none bg-transparent cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-[#FFEBF0] text-[#E1306C] flex justify-center items-center group-hover:scale-110 transition-transform duration-300 shadow-sm"><AtSign size={24} /></div>
              <span className="text-[10px] font-bold text-gray-500">Instagram</span>
            </button>
            <button className="flex flex-col items-center gap-2 border-none bg-transparent cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-[#E8F8F0] text-[#25D366] flex justify-center items-center group-hover:scale-110 transition-transform duration-300 shadow-sm"><Smartphone size={24} /></div>
              <span className="text-[10px] font-bold text-gray-500">WhatsApp</span>
            </button>
          </div>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Envoyer en message privé</div>
          <div className="flex flex-col gap-3">
            {friends.map(friend => {
              const isSent = sentTo.includes(friend.id);
              return (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-50">
                  <div className="flex items-center gap-3">
                    <img src={friend.avatar} alt={friend.tag} className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white" />
                    <span className="font-extrabold text-gray-800 text-sm">{friend.tag}</span>
                  </div>
                  <button 
                    onClick={() => !isSent && handleSendToFriend(friend)}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 border-none cursor-pointer transition-all shadow-sm ${
                      isSent ? 'bg-green-500 text-white cursor-default' : 'bg-primary text-white hover:bg-purple-700 hover:scale-105'
                    }`}
                  >
                    {isSent ? <Check size={14} /> : <Send size={14} />}
                    {isSent ? 'Envoyé' : 'Envoyer'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

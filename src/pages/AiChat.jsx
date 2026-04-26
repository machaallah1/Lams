import { useState } from 'react';
import { Send, Upload, Sparkles, Bot } from 'lucide-react';
import PremiumPaywall from '../components/AiStylist/PremiumPaywall';
import { useToastStore } from '../store/toastStore';

export default function AiChat() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Bonjour ! Je suis votre IA Styliste personnelle. Prêt à améliorer votre style ? Envoyez-moi une photo ou posez-moi une question." }
  ]);
  const [inputText, setInputText] = useState("");
  const addToast = useToastStore(state => state.addToast);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    addToast("Abonnement activé ! L'IA est prête à vous conseiller.", "success");
  };

  const handleSend = () => {
    if(!inputText.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'me', text: inputText };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");

    // Simulation de réponse de l'IA
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "Excellente idée. Avec ce genre de pièce, je recommande d'associer des tons clairs pour créer du contraste. Voulez-vous que je génère un exemple visuel ?" 
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-hidden relative">
      {!isSubscribed && <PremiumPaywall onSubscribe={handleSubscribe} />}

      <div className="max-w-4xl mx-auto h-full flex flex-col glass rounded-[40px] overflow-hidden shadow-sm">
        
        {/* Chat Header */}
        <div className="bg-white/80 backdrop-blur-md p-6 border-b border-primary/10 flex items-center gap-4 z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-primary flex items-center gap-2">
              Vision Stylist AI <Sparkles size={16} className="text-orange-400" />
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> En ligne
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${
                msg.sender === 'me' 
                  ? 'bg-primary text-white rounded-br-sm shadow-md' 
                  : 'bg-white text-gray-700 rounded-bl-sm shadow-sm border border-gray-100'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 backdrop-blur-md border-t border-primary/10">
          <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-inner border border-gray-100">
            <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-full border-none cursor-pointer">
              <Upload size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Demandez un conseil (ex: 'Est-ce que cette veste me va ?')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm text-gray-700 placeholder-gray-400 font-medium disabled:opacity-50"
              disabled={!isSubscribed}
            />
            <button 
              onClick={handleSend}
              disabled={!isSubscribed || !inputText.trim()}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors border-none cursor-pointer shadow-md"
            >
              <Send size={18} className="translate-x-[-1px]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
